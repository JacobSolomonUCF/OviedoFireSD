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
    var resultForm = result(completeBy: "Default", timeStamp: "Default", title: "Default", resultSection: [])
    var list: [compartments] = []
    var userName:[String] = []
    let userID = Auth.auth().currentUser!.uid
    var formID:String = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupView()
    }
    
    func setupView(){
        stopSpinning(activityView: activityView)
        navigationController?.navigationBar.prefersLargeTitles = true
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
            nextController.userEnteredResults = createResults(form: form)
            nextController.form = form
            nextController.formName = formName
            nextController.userName = userName
            nextController.formId = formID
            self.stopSpinning(activityView: self.activityView)
            tableView.allowsSelection = true
            
        }else if (segue.identifier == "toResult"){
            let nextController = segue.destination as! resultsViewController
            nextController.resultForm = resultForm
            nextController.userName = userName
            
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
                    self.formID = self.list[indexPath.row].formId
                    self.performSegue(withIdentifier: "toForm", sender: nil)
                })
                
            }else{

                
//                self.alert(message: "This form has already been completed")
                self.getResults(userID: self.userID, formId: self.list[indexPath.row].formId, completion: { (result) in
                    self.resultForm = result
                    self.stopSpinning(activityView: self.activityView)
                    
                    let refreshAlert = UIAlertController(title: "Attention", message: "This form has already been completed", preferredStyle: UIAlertControllerStyle.alert)
                    self.present(refreshAlert, animated: true, completion: nil)
                    refreshAlert.addAction(UIAlertAction(title: "Ok", style: .default, handler: { (action: UIAlertAction!) in
                        self.performSegue(withIdentifier: "toResult" , sender: nil)
                    }))
                })



            }
            tableView.allowsSelection = true
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
