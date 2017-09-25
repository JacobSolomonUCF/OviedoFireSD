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
   
    @IBOutlet weak var table: UITableView!
    

    var list: [active] = []
    var truckCompartments: [compartments] = []
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
    
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        if segue.identifier == "toCompartments"{
            let nextController = segue.destination as! CompartmentsViewController
            nextController.list = truckCompartments
            
        }
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        print(list[indexPath.row])
        getCompartments(singleSelection: list[indexPath.row].number, completion:{
            print("YESSS")
            self.performSegue(withIdentifier: "toCompartments", sender: (Any).self)
        })
        //singleSelection.name = list[indexPath.row].name
        //singleSelection.id = list[indexPath.row].number
        
        //list[indexPath.row].name
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
    
    
    func getCompartments(singleSelection:String,completion : @escaping ()->()){
        
        let userID:String = (Auth.auth().currentUser?.uid)!
        
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
