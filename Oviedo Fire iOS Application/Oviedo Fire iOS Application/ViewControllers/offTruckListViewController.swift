//
//  offTruckListViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 10/1/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit
import Alamofire
import Firebase


class offTruckListViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, formCompleted {
    
    @IBOutlet weak var backgroundImage: UIImageView!
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    
    
    let userID = Auth.auth().currentUser!.uid
    var list:[offTruck] = []
    var form = completeForm(title: "Default", alert: "Default" , subSection: [] )
    var resultForm = result(completeBy: "Default", timeStamp: "Default", title: "Default", resultSection: [])
    var singleFormId:String = ""
    var type:String = ""
    var offTruckSection:String = ""
    var formName:String = ""
    var userName:[String] = []
    
    func sendSelectionListBack(data: [Any]) {
        list = data as! [offTruck]
        tableView.reloadData()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupView()

    }
    
    func setupView(){
        stopSpinning(activityView: activityView)
        self.tableView?.rowHeight = 70.0
        navigationItem.title = type
        
        // Create  button for navigation item with refresh
        let refreshButton =  UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.refresh, target: self, action: #selector(offTruckListViewController.actionRefresh))
        
        // I set refreshButton for the navigation item
        navigationItem.rightBarButtonItem = refreshButton
        
        switch type {
        case "Stretchers":
            backgroundImage.backgroundColor = hexStringToUIColor(hex: "0b6e4f")
        case "Ladders":
            backgroundImage.backgroundColor = hexStringToUIColor(hex: "db7c26")
        case "Misc.":
            backgroundImage.backgroundColor = hexStringToUIColor(hex: "624c2b")
        case "Scbas":
            backgroundImage.backgroundColor = hexStringToUIColor(hex: "2b4162")
        default:
            print("NO IMAGE")
        }
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.navigationController?.isNavigationBarHidden = false
        navigationController?.navigationBar.prefersLargeTitles = true
        if let selectionIndexPath = self.tableView.indexPathForSelectedRow {
            self.tableView.deselectRow(at: selectionIndexPath, animated: animated)
        }
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        if (segue.identifier == "toForm"){
            let nextController = segue.destination as! EqFormViewController
            nextController.userEnteredResults = createResults(form: form)
            nextController.formId = singleFormId
            nextController.form = form
            nextController.userName = userName
            nextController.commingFrom.type = "offtruck"
            nextController.commingFrom.section = offTruckSection
            nextController.isEdited = false
            nextController.delegate = self
            
        }else if(segue.identifier == "toResult"){
            let nextController = segue.destination as! resultsViewController
            nextController.resultForm = resultForm
            nextController.userName = userName
            nextController.commingFrom.type = "offtruck"
            nextController.commingFrom.section = offTruckSection
            nextController.formId = singleFormId
        }
        
        stopSpinning(activityView: activityView)
        tableView.isUserInteractionEnabled = true
    }
    @objc func actionRefresh() {
        startSpinning(activityView: activityView)
        tableView.isUserInteractionEnabled = false
        getOffTruck(userID: userID, type: offTruckSection){ (result) in
            self.list = result
            self.tableView.reloadData()
            self.stopSpinning(activityView: self.activityView)
            self.tableView.isUserInteractionEnabled = true
        }
    }    
}




//    MARK: TABLE FUNCTIONS
extension offTruckListViewController{
    //List item is tapped
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {

        tableView.isUserInteractionEnabled = false
        startSpinning(activityView: activityView)
        singleFormId = list[indexPath.row].formId
        formName = list[indexPath.row].name
        
        checkCompletion(userID: userID, formId: singleFormId) { (result) in
            if(result == "true"){
                self.getResults(userID: self.userID, formId: self.singleFormId, completion: { (results) in
                    self.resultForm = results
                    self.sendBackAlert(message: "This form has been completed", title: "", completion: {
                        self.performSegue(withIdentifier: "toResult", sender: nil)
                    })
                })
                
            }else{
                self.getForm(userID: self.userID, formId: self.singleFormId) { (list) in
                    self.form = list
                    self.performSegue(withIdentifier: "toForm", sender: nil)
                    
                }
            }
        }
        
        
        
        
    }
    
    //Number of cells
    func tableView(_ tableView:UITableView, numberOfRowsInSection section:Int) -> Int
    {
        return list.count
    }
    
    
    //Cell formatting
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath) as! TwoItemTableViewCell
        cell.backgroundColor = UIColor.clear
        tableView.backgroundColor = UIColor.clear
        cell.formName.text = list[indexPath.row].name
        if(list[indexPath.row].completedBy != "nobody"){
            cell.completedBy.text = "Completed By: " + list[indexPath.row].completedBy
        }else{
            cell.completedBy.text = ""
        }
        
        return cell
    }
}
