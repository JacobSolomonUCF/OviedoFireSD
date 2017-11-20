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

class CompartmentsViewController: UIViewController, UITableViewDataSource, UITableViewDelegate, formCompleted {
    func sendSelectionListBack(data: [Any]) {
        list = data as! [compartments]
        tableView.reloadData()
        navigationController?.title = "TEST"
    }
    
    
    //    Linking the buttons:
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    @IBOutlet weak var tableView: UITableView!
    //    Needed Variables:
    var formName = ""
    var vehicle = ""
    var form = completeForm(title: "Default", alert: "Default" , subSection: [] )
    var resultForm = result(completeBy: "Default", timeStamp: "Default", title: "Default", resultSection: [])
    var list: [compartments] = []
    var userName:[String] = []
    let userID = Auth.auth().currentUser!.uid
    var formID:String = ""
    var truckNumber:String = ""
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.navigationBar.prefersLargeTitles = true
        if let selectionIndexPath = self.tableView.indexPathForSelectedRow {
            self.tableView.deselectRow(at: selectionIndexPath, animated: animated)
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupView()
    }
    
    func setupView(){
        stopSpinning(activityView: activityView)
        navigationController?.navigationBar.prefersLargeTitles = true
        navigationItem.title = vehicle
        
        // Create  button for navigation item with refresh
        let refreshButton =  UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.refresh, target: self, action: #selector(CompartmentsViewController.actionRefresh))
        
        // I set refreshButton for the navigation item
        navigationItem.rightBarButtonItem = refreshButton
        
        
        self.tableView?.rowHeight = 70.0
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    @objc func actionRefresh() {
        startSpinning(activityView: activityView)
        tableView.isUserInteractionEnabled = false
        getCompartments(singleSelection: truckNumber) { (result) in
            self.list = result
            self.tableView.reloadData()
            self.stopSpinning(activityView: self.activityView)
            self.tableView.isUserInteractionEnabled = true
            
        }
    }
    
    //Prepare for segue
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toForm"{
            let nextController = segue.destination as! EqFormViewController
            nextController.userEnteredResults = createResults(form: form)
            nextController.form = form
            nextController.userName = userName
            nextController.formId = formID
            nextController.commingFrom.type = "compartment"
            nextController.commingFrom.section = truckNumber
            nextController.isEdited = false
            nextController.delegate = self
            
            
            self.stopSpinning(activityView: self.activityView)
            tableView.allowsSelection = true
            
        }else if (segue.identifier == "toResult"){
            let nextController = segue.destination as! resultsViewController
            nextController.resultForm = resultForm
            nextController.userName = userName
            nextController.commingFrom.type = "compartment"
            nextController.commingFrom.section = truckNumber
            nextController.formId = formID
            
        }
        tableView.isUserInteractionEnabled = true
    }
    
}


//    MARK: TABLE FUNCTIONS
extension CompartmentsViewController{
    
    //    For when a table view is selected
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        startSpinning(activityView: activityView)
        tableView.isUserInteractionEnabled = false
        
        
        //    Checking if the form has been completed:
        checkCompletion(userID: userID, formId: list[indexPath.row].formId, completion: { (isCompleted) in
            if(isCompleted == "false"){
                self.formName = self.list[indexPath.row].formName
                self.getForm(userID: self.userID, formId: self.list[indexPath.row].formId, completion:{(data) -> Void in
                    self.form = data
                    self.formID = self.list[indexPath.row].formId
                    self.performSegue(withIdentifier: "toForm", sender: nil)
                })
                
            }else{
                self.getResults(userID: self.userID, formId: self.list[indexPath.row].formId, completion: { (result) in
                    self.formID = self.list[indexPath.row].formId
                    self.resultForm = result
                    self.stopSpinning(activityView: self.activityView)
                    
                    let refreshAlert = UIAlertController(title: "Attention", message: "This form has already been completed", preferredStyle: UIAlertControllerStyle.alert)
                    self.present(refreshAlert, animated: true, completion: nil)
                    refreshAlert.addAction(UIAlertAction(title: "Okay", style: .default, handler: { (action: UIAlertAction!) in
                        self.performSegue(withIdentifier: "toResult" , sender: nil)
                    }))
                })



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
