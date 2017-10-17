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

class offTruckViewController: UIViewController {
    
    //Buttons
    @IBOutlet weak var stretchers: UIButton!
    @IBOutlet weak var ladders: UIButton!
    @IBOutlet weak var scba: UIButton!
    @IBOutlet weak var misc: UIButton!
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    
    //Variables
    var type:String = ""
    var offTruckItem: [offTruck] = []
    let ID = Auth.auth().currentUser!.uid
    var userName:[String] = []
    
    //Prepare for Segues
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
    
        if segue.identifier == "toOffTruckList"{
            let nextController = segue.destination as! offTruckListViewController
            nextController.list = offTruckItem
            nextController.type = type
            self.enableButtons()
            stopSpinning(activityView: activityView)
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        
        stopSpinning(activityView: activityView)
        UIFormat()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    //    MARK: UI FUNCTIONS
    func UIFormat() {
        stretchers.layer.cornerRadius = 40
        stretchers.clipsToBounds = true
        ladders.layer.cornerRadius = 40
        ladders.clipsToBounds = true
        scba.layer.cornerRadius = 40
        scba.clipsToBounds = true
        misc.layer.cornerRadius = 40
        misc.clipsToBounds = true
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
    
    //    Generic get off truck call
    func offTruckList(Type:String){
        disableButtons()
        startSpinning(activityView: activityView)
        getOffTruck(userID: ID, type: Type, completion: {(items) -> Void in
            self.offTruckItem = items
            self.performSegue(withIdentifier: "toOffTruckList", sender: nil)
        })
    }
    
    // MARK: ACTIONS
    @IBAction func stretchersClicked(_ sender: Any) {
        offTruckList(Type: "stretchers")
        type = "Stretchers"
    }
    @IBAction func laddersClicked(_ sender: Any) {
        offTruckList(Type: "ladders")
        type = "Ladders"
    }
    @IBAction func scbaClicked(_ sender: Any) {
        offTruckList(Type: "scbas")
        type = "Scbas"
    }
    @IBAction func miscClicked(_ sender: Any) {
        offTruckList(Type: "misc")
        type = "Misc."
    }
 
}
