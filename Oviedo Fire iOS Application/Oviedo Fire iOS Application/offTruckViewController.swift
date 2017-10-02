//
//  offTruckViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 8/30/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit
import Firebase
import Alamofire


struct offTruck{
    var name: String
    var formId: String
    var completedBy: String
    
    init(name:String,formId:String, completedBy:String) {
        self.name = name
        self.formId = formId
        self.completedBy = completedBy
    }
}

class offTruckViewController: UIViewController {

    @IBOutlet weak var stretchers: UIButton!
    @IBOutlet weak var ladders: UIButton!
    @IBOutlet weak var scba: UIButton!
    @IBOutlet weak var misc: UIButton!
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    
    var offTruckItem: [offTruck] = []
    let ID = Auth.auth().currentUser!.uid
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
    
        if segue.identifier == "toOffTruckList"{
            let nextController = segue.destination as! offTruckListViewController
            nextController.list = offTruckItem
            self.enableButtons()
        }
    }
    
    override func viewDidLoad() {
        activityView.isHidden = true
        
        super.viewDidLoad()
        
        stretchers.layer.cornerRadius = 40
        stretchers.clipsToBounds = true
        ladders.layer.cornerRadius = 40
        ladders.clipsToBounds = true
        scba.layer.cornerRadius = 40
        scba.clipsToBounds = true
        misc.layer.cornerRadius = 40
        misc.clipsToBounds = true

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func disableButtons(){
        stretchers.isEnabled = false
        ladders.isEnabled = false
        scba.isEnabled = false
        misc.isEnabled = false
    }
    
    func enableButtons(){
        stretchers.isEnabled = true
        ladders.isEnabled = true
        scba.isEnabled = true
        misc.isEnabled = true
    }
    
    
    func getOffTruck(userID:String,type:String,completion : @escaping ()->()){
        
        if(self.offTruckItem.count != 0){
            self.offTruckItem.removeAll()
        }
        
        Alamofire.request("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/\(type)?uid=\(userID)") .responseJSON { response in
            if let result = response.result.value as? [String:Any],
                let main = result["list"] as? [[String:String]]{
                // main[0]["name"] or use main.first?["name"] for first index or loop through array
                for obj in main{
                    self.offTruckItem.append(offTruck(name: obj["name"]!, formId: obj["formId"]!, completedBy: obj["completedBy"]!))
                }
            }
            completion()
        }
    }

    // MARK: - ACTIONS
    
    
    @IBAction func stretchersClicked(_ sender: Any) {
        disableButtons()
        activityView.isHidden = false
        activityView.startAnimating()
        getOffTruck(userID: ID, type: "stretchers", completion: {
            self.activityView.stopAnimating()
            self.activityView.isHidden = true
            self.performSegue(withIdentifier: "toOffTruckList", sender: nil)
        })
        
        
    }
    @IBAction func laddersClicked(_ sender: Any) {
        disableButtons()
        activityView.isHidden = false
        activityView.startAnimating()
        getOffTruck(userID: ID, type: "ladders", completion: {
            self.activityView.stopAnimating()
            self.activityView.isHidden = true
            self.performSegue(withIdentifier: "toOffTruckList", sender: nil)
        })
    }
    @IBAction func scbaClicked(_ sender: Any) {
        disableButtons()
        activityView.isHidden = false
        activityView.startAnimating()
        getOffTruck(userID: ID, type: "scbas", completion: {
            self.activityView.stopAnimating()
            self.activityView.isHidden = true
            self.performSegue(withIdentifier: "toOffTruckList", sender: nil)
        })
    }
    @IBAction func miscClicked(_ sender: Any) {
        disableButtons()
        activityView.isHidden = false
        activityView.startAnimating()
        getOffTruck(userID: ID, type: "misc", completion: {
            self.activityView.stopAnimating()
            self.activityView.isHidden = true
            self.performSegue(withIdentifier: "toOffTruckList", sender: nil)
        })
    }
 
}
