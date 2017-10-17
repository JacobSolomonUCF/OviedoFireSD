//
//  CompartmentsViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 9/20/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit
import Firebase
import Alamofire

class CompartmentsViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    
    //    Linking the buttons:
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    @IBOutlet weak var tableView: UITableView!
    //    Needed Variables:
    var formName = ""
    var vehicle = ""
    var form = completeForm(title: "Default", alert: "Default" , subSection: [] )
    var list: [compartments] = []
    var userName:[String] = []
    let userID = Auth.auth().currentUser!.uid
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupView()
    }
    
    func setupView(){
        stopSpinning(activityView: activityView)
        navigationItem.title = vehicle
        self.tableView?.rowHeight = 70.0
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    //Prepare for segue
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toForm"{
            let nextController = segue.destination as! EqFormViewController
            nextController.form = form
            nextController.formName = formName
            nextController.userName = userName
            self.stopSpinning(activityView: self.activityView)
            tableView.allowsSelection = true
            
        }
    }
    
}


//    MARK: TABLE FUNCTIONS
extension CompartmentsViewController{
    
    //    For when a table view is selected
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        startSpinning(activityView: activityView)
        tableView.allowsSelection = false
        
        
        //    Checking if the form has been completed:
        checkCompletion(userID: userID, formId: list[indexPath.row].formId, completion: { (isCompleted) in
            if(isCompleted == "false"){
                self.formName = self.list[indexPath.row].formName
                self.getForm(userID: self.userID, formId: self.list[indexPath.row].formId, completion:{(data) -> Void in
                    self.form = data
                    self.performSegue(withIdentifier: "toForm", sender: nil)
                })
                
            }else{
                self.alert(message: "Sorry! This form has been completed")
                self.stopSpinning(activityView: self.activityView)
                tableView.allowsSelection = true
            }
        })

    }
    
    //    List of table elements
    func tableView(_ tableView:UITableView, numberOfRowsInSection section:Int) -> Int
    {
        return list.count
    }
    
    //    Generate the table view
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath) as! TwoItemTableViewCell
        cell.backgroundColor = UIColor.clear
        tableView.backgroundColor = UIColor.clear
        cell.formName.text = list[indexPath.row].formName
        if(list[indexPath.row].completeBy != "nobody"){
            cell.completedBy.text = "Completed By: " + list[indexPath.row].completeBy
        }else{
            cell.completedBy.text = ""
        }
        return cell
    }
    
}
