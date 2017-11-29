//
//  ActiveViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 9/13/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit
import Alamofire
import Firebase


class ActiveViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
   
    //Tableview and Activity Indicator
    @IBOutlet weak var table: UITableView!
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    
    var truckName:String = "\0"
    var list: [active] = []
    var truckCompartments: [compartments] = []
    var userName:[String] = []
    var truckNumber:String = ""
    
    func setupView(){
        self.navigationController?.isNavigationBarHidden = false
        stopSpinning(activityView: activityView)
        navigationController?.navigationBar.prefersLargeTitles = true
        navigationItem.title = "Active Vehicles"
        
    }
    
    
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        if let selectionIndexPath = self.table.indexPathForSelectedRow {
            self.table.deselectRow(at: selectionIndexPath, animated: animated)
        }
        if(Auth.auth().currentUser == nil){
            sendBackAlert(message: "You have been timed out, please login again", completion: {
                self.navigationController?.popToRootViewController(animated: true)
            })
        }

        
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupView()
    
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    //Prepare for Segues
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        if segue.identifier == "toCompartments"{
            self.stopSpinning(activityView: self.activityView)
            self.table.allowsSelection = true
            let nextController = segue.destination as! CompartmentsViewController
            nextController.list = truckCompartments
            nextController.vehicle = truckName
            nextController.userName = userName
            nextController.truckNumber = truckNumber
            
        }
        
        table.isUserInteractionEnabled = true
    }

}


//    MARK: TABLE FUNCTIONS
extension ActiveViewController{
    
    //Table Functions
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        startSpinning(activityView: activityView)
        table.isUserInteractionEnabled = false
        if(truckCompartments.count != 0){
            truckCompartments.removeAll()
        }
        
        var split = list[indexPath.row].name.components(separatedBy: "/")
        truckName = split[0]
        
        
        truckNumber = list[indexPath.row].number
        getCompartments(singleSelection: list[indexPath.row].number, completion:{(list) -> Void in
            self.truckCompartments = list
            self.performSegue(withIdentifier: "toCompartments", sender: (Any).self)
        })
    }
    
    func tableView(_ tableView:UITableView, numberOfRowsInSection section:Int) -> Int
    {
        return list.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        let name = list[indexPath.row].name
        var split = name.components(separatedBy: "/")
                
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath) as! ActiveTableViewCell
        cell.backgroundColor = UIColor.clear
        tableView.backgroundColor = UIColor.clear
        
        if(name.contains("/")){
            cell.vehicleName.text = split[0]
            cell.vehicleName2.text = split[1]
        }else{
            cell.vehicleName.text = split[0]
            cell.vehicleName2.text = ""
        }
    
        return cell
    }
    //End Table Functions
    
}
