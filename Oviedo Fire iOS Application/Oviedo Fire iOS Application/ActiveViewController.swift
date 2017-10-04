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


struct compartments {
    var truckname: String
    var formId: String
    var completeBy: String
    
    init(truckname:String,formId:String,completedBy:String) {
        self.completeBy = completedBy
        self.formId = formId
        self.truckname = truckname
    }
    
}

class ActiveViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
   
    //Tableview and Activity Indicator
    @IBOutlet weak var table: UITableView!
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    
    var list: [active] = []
    var truckCompartments: [compartments] = []
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        if let selectionIndexPath = self.table.indexPathForSelectedRow {
            self.table.deselectRow(at: selectionIndexPath, animated: animated)
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        activityView.isHidden = true
        activityView.center = self.view.center
    
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    //Prepare for Segues
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        if segue.identifier == "toCompartments"{
            let nextController = segue.destination as! CompartmentsViewController
            nextController.list = truckCompartments
            
        }
    }
    //Table Functions
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        print(list[indexPath.row])
        activityView.isHidden = false
        activityView.startAnimating()
        table.allowsSelection = false
        
        getCompartments(singleSelection: list[indexPath.row].number, completion:{
            self.activityView.stopAnimating()
            self.activityView.isHidden = true
            self.table.allowsSelection = true
            self.performSegue(withIdentifier: "toCompartments", sender: (Any).self)
        })
    }
    
    func tableView(_ tableView:UITableView, numberOfRowsInSection section:Int) -> Int
    {
        return list.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        let cell:UITableViewCell=UITableViewCell(style: UITableViewCellStyle.subtitle, reuseIdentifier: "cell")
        cell.textLabel?.text = list[indexPath.row].name
        cell.detailTextLabel?.text =  list[indexPath.row].number
        return cell
    }
    //End Table Functions
    
    //Get Compartments
    func getCompartments(singleSelection:String,completion : @escaping ()->()){
        
        let userID:String = (Auth.auth().currentUser?.uid)!

        
        if(self.truckCompartments.count != 0){
            self.truckCompartments.removeAll()
        }
        
        Alamofire.request("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/vehicleCompartments?uid=\(userID)&vehicleId=\(singleSelection)") .responseJSON { response in
            if let result = response.result.value as? [String:Any],
                let main = result["list"] as? [[String:String]]{
                // main[0]["name"] or use main.first?["name"] for first index or loop through array
                for obj in main{
                    self.truckCompartments.append(compartments(truckname: obj["name"]!, formId: obj["formId"]!, completedBy: obj["completedBy"]!))
                }
            }
            completion()
        }
    }
    
}
