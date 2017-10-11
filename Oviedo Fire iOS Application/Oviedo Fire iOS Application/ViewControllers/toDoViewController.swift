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
    
    var form: [formItem] = []
    var list: [toDo] = []
    let userID = Auth.auth().currentUser!.uid
    var singleFormId:String = ""
    
    @IBAction func backButtonClicked(_ sender: Any) {
        performSegue(withIdentifier: "back", sender: nil)
    }
    
    
    func setupView(){
        stopSpinning(activityView: activityView)
        self.tableView?.rowHeight = 70.0
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
            
        }
    }
    
}

extension toDoViewController{
    
    //    Table Functions:
    //    List item is tapped:
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        print(list[indexPath.row])
        activityView.isHidden = false
        activityView.startAnimating()
        singleFormId = list[indexPath.row].formId
        
        getForm(userID: userID, formId: singleFormId, completion: {(form) -> Void in
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
        let formName = String(fullName[sIndex...])
        if(formName == firstName){
            firstName = " "
        }
        //  Sets the views labels:
        cell.formName.text = formName
        cell.vehicleName.text = firstName
        cell.completeBy.text = "Complete by " + list[indexPath.row].completeBy
        return cell
    }
    //    END Table Function:
}
