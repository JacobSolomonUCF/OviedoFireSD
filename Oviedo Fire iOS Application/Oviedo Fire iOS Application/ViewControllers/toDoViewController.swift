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


class toDoViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
   
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    
    var formName = ""
    var form = completeForm(title: "Default", alert: "Default" , subSection: [] )
    var list: [toDo] = []
    let userID = Auth.auth().currentUser!.uid
    var singleFormId:String = ""
    
    
    
    func setupView(){
        stopSpinning(activityView: activityView)
        self.tableView?.rowHeight = 70.0
        navigationItem.title = "ToDo List"
        let searchController = UISearchController(searchResultsController: nil)
        navigationItem.searchController = searchController
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
            
        }
        self.stopSpinning(activityView: self.activityView)
    }
    
}

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
        return list.count
    }
    
    
    
    
    //    Cell formatting:
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath) as! toDoListTableViewCell
        cell.backgroundColor = UIColor.clear
        tableView.backgroundColor = UIColor.clear
        let fullName:String = list[indexPath.row].name
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
        cell.completeBy.text = "Complete by " + list[indexPath.row].completeBy
        return cell
    }
    //    END Table Function:
}
