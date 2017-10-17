//
//  toDoViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 10/1/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit
import Firebase
import Alamofire

extension toDoViewController: UISearchResultsUpdating {
    // MARK: - UISearchResultsUpdating Delegate
    func updateSearchResults(for searchController: UISearchController) {
        filterContentForSearchText(searchController.searchBar.text!)
    }
}

class toDoViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
   
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    
    var formName = ""
    var form = completeForm(title: "Default", alert: "Default" , subSection: [] )
    var list: [toDo] = []
    var filterdList: [toDo] = []
    let userID = Auth.auth().currentUser!.uid
    var singleFormId:String = ""
    let searchController = UISearchController(searchResultsController: nil)
    var userName:[String] = []
    
    func isFiltering() -> Bool {
        return searchController.isActive && !searchBarIsEmpty()
    }
    func searchBarIsEmpty() -> Bool {
        // Returns true if the text is empty or nil
        return searchController.searchBar.text?.isEmpty ?? true
    }
    
    func filterContentForSearchText(_ searchText: String, scope: String = "All") {
        filterdList = list.filter({( list : toDo) -> Bool in
            return list.name.lowercased().contains(searchText.lowercased())
        })
        
        tableView.reloadData()
    }

    func setupView(){
        stopSpinning(activityView: activityView)
        self.tableView?.rowHeight = 70.0
        navigationItem.title = "ToDo List"
        
        navigationItem.searchController = searchController
        
        searchController.searchResultsUpdater = self
        searchController.dimsBackgroundDuringPresentation = false
        definesPresentationContext = true
        navigationItem.hidesSearchBarWhenScrolling = true
        
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupView()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
//         Dispose of any resources that can be recreated.
    }
    
//         Prepare for Segues
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toForm"{
            let nextController = segue.destination as! EqFormViewController
            nextController.form = form
            nextController.formName = formName
            nextController.userName = userName
            
        }
        self.stopSpinning(activityView: self.activityView)
    }
    
}


//    MARK: TABLE FUNCTIONS
extension toDoViewController{
    
    //    Table Functions:
    //    List item is tapped:
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        startSpinning(activityView: activityView)
        singleFormId = list[indexPath.row].formId
        let fullName = list[indexPath.row].name
        if(fullName.contains("Check-Off")){
            formName = fullName
        }else{
            var sIndex = fullName.index(of:"-") ?? fullName.endIndex
            sIndex = fullName.index(sIndex, offsetBy: 2)
            formName = String(fullName[sIndex...])
            
        }

        
        
        getForm(userID: userID, formId: singleFormId, completion: {(form) -> Void in
            self.form = form
            self.performSegue(withIdentifier: "toForm", sender: nil)
            
            
        })
        
        
        
    }
    
    //    Number of cells:
    func tableView(_ tableView:UITableView, numberOfRowsInSection section:Int) -> Int
    {
        if isFiltering() {
            return filterdList.count
        }
        return list.count
    }
    
    
    
    
    //    Cell formatting:
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath) as! toDoListTableViewCell
        let item: toDo
        if isFiltering() {
            item = filterdList[indexPath.row]
        } else {
            item = list[indexPath.row]
        }
        cell.backgroundColor = UIColor.clear
        tableView.backgroundColor = UIColor.clear
        let fullName:String = item.name
        var fIndex = fullName.endIndex
        var sIndex = fullName.index(of:"-") ?? fullName.endIndex
        
        if(fullName.contains("/")){                 //For the default case
            fIndex = fullName.index(of:"/") ?? fullName.endIndex
            sIndex = fullName.index(sIndex, offsetBy: 2)
        }else if(!fullName.contains(" - ")){        //For the case with no name at all
            fIndex = fullName.endIndex
            sIndex = fullName.startIndex
        }else{                                      //For the case with no second name
            fIndex = fullName.index(of:"-") ?? fullName.endIndex
            sIndex = fullName.index(sIndex, offsetBy: 2)
        }
        
        //  Parsing the string:
        var firstName = String(fullName[..<fIndex])
        let oneFormName = String(fullName[sIndex...])
        if(oneFormName == firstName){
            firstName = " "
        }
        //  Sets the views labels:
        cell.formName.text = oneFormName
        cell.vehicleName.text = firstName
        cell.completeBy.text = "Complete by " + item.completeBy
        return cell
    }
    //    END Table Function:
}
