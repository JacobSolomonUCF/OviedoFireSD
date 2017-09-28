//
//  HomeViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 8/29/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit
import Firebase
import Alamofire

struct active{
    var name: String
    var number: String
    
    init(truckName:String,truckNumber:String) {
        self.name = truckName
        self.number = truckNumber
    }
}

class HomeViewController: UIViewController {
    

    @IBOutlet weak var activeButton: UIButton!
    @IBOutlet weak var offTruck: UIButton!
    @IBOutlet weak var todoList: UIButton!
    @IBOutlet weak var qrCode: UIButton!
    
    let ID = Auth.auth().currentUser!.uid
    var activeTrucks: [active] = []
    let activityView = UIActivityIndicatorView(activityIndicatorStyle: .whiteLarge)
    
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        if segue.identifier == "toActive"{
            let nextController = segue.destination as! ActiveViewController
            nextController.list = activeTrucks
            self.enableButtons()
        }
        
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        screenFormat()
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


    func screenFormat(){
        activeButton.layer.cornerRadius = 40
        activeButton.clipsToBounds = true
        offTruck.layer.cornerRadius = 40
        offTruck.clipsToBounds = true
        todoList.layer.cornerRadius = 40
        todoList.clipsToBounds = true
        qrCode.layer.cornerRadius = 40
        qrCode.clipsToBounds = true
        
        activityView.center = self.view.center
        
    }
    
    func disableButtons(){
        activeButton.isEnabled = false
        offTruck.isEnabled = false
        todoList.isEnabled = false
        qrCode.isEnabled = false
        
    }
    func enableButtons(){
        activeButton.isEnabled = true
        offTruck.isEnabled = true
        todoList.isEnabled = true
        qrCode.isEnabled = true
        
    }
    
    //Actions
    @IBAction func Logout(_ sender: Any) {
        do {
            try Auth.auth().signOut()
            self.performSegue(withIdentifier: "toLogin", sender: nil)
        }catch let error as NSError{
            print("Error signing out: \(error)")
        }
    }
    
    @IBAction func activeClicked(_ sender: Any) {
        //Disable other buttons
        disableButtons()
        
        //Start the activity view
        activityView.startAnimating()
        self.view.addSubview(activityView)
        
        getActive(userID: ID, completion: {
            self.activityView.stopAnimating()
            self.view.willRemoveSubview(self.activityView)
            self.performSegue(withIdentifier: "toActive", sender: nil)
        })
    }
    
    func getActive(userID:String,completion : @escaping ()->()){
        
        if(self.activeTrucks.count != 0){
            self.activeTrucks.removeAll()
        }
        
        Alamofire.request("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/activeVehicles?uid=\(userID)") .responseJSON { response in
            if let result = response.result.value as? [String:Any],
                let main = result["list"] as? [[String:String]]{
                // main[0]["name"] or use main.first?["name"] for first index or loop through array
                for obj in main{
                    self.activeTrucks.append(active(truckName: obj["name"]!, truckNumber: obj["id"]!))
                }
            }
        completion()
        }
    }
}
