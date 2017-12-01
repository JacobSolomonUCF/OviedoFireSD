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
    var offTruckSection:String = ""
    var type:String = ""
    var offTruckItem: [offTruck] = []
    let ID = Auth.auth().currentUser!.uid
    var userName:[String] = []
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.navigationBar.prefersLargeTitles = false
        
    }
    
    //Runs when phone enters landscape/Portrait
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    @objc func rotated() {
        UIFormat()
    }
    
    //Prepare for Segues
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
    
        if segue.identifier == "toOffTruckList"{
            let nextController = segue.destination as! offTruckListViewController
            nextController.list = offTruckItem
            nextController.type = type
            nextController.userName = userName
            nextController.offTruckSection = offTruckSection
            self.enableButtons()
            stopSpinning(activityView: activityView)
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        
        
        navigationController?.navigationBar.prefersLargeTitles = true
        NotificationCenter.default.addObserver(self, selector: #selector(offTruckViewController.rotated), name: NSNotification.Name.UIDeviceOrientationDidChange, object: nil)
        
        let delay = 0.1 // Paused until the view is fully loaded then rounds the buttons
        Timer.scheduledTimer(timeInterval: delay, target: self, selector: #selector(UIFormat), userInfo: nil, repeats: false)
        
        stopSpinning(activityView: activityView)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    //    MARK: UI FUNCTIONS
    @objc func UIFormat() {
        
        
        stretchers.layer.cornerRadius = stretchers.layer.frame.height/4
        stretchers.clipsToBounds = true
        ladders.layer.cornerRadius = ladders.layer.frame.height/4
        ladders.clipsToBounds = true
        scba.layer.cornerRadius = scba.layer.frame.height/4
        scba.clipsToBounds = true
        misc.layer.cornerRadius = misc.layer.frame.height/4
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
        offTruckSection = Type
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
