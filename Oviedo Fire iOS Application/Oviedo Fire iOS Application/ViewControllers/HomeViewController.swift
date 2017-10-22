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


class HomeViewController: UIViewController {
    
    //Buttons
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    @IBOutlet weak var activeButton: UIButton!
    @IBOutlet weak var offTruck: UIButton!
    @IBOutlet weak var todoList: UIButton!
    @IBOutlet weak var qrCode: UIButton!
   
    //Variables
    let ID = Auth.auth().currentUser!.uid
    var activeTrucks: [active] = []
    var TODOList: [toDo] = []
    var firstName:[String] = []
    
    //Prepare for segues
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let backItem = UIBarButtonItem()
        backItem.title = "Home"
        navigationItem.backBarButtonItem = backItem
        
        if segue.identifier == "toActive"{
            let nextController = segue.destination as! ActiveViewController
            nextController.list = activeTrucks
            nextController.userName = firstName
            self.enableButtons()
            self.stopSpinning(activityView: self.activityView)
        }
        if segue.identifier == "toToDoList"{
            let nextController = segue.destination as! toDoViewController
            nextController.list = TODOList
            nextController.filterdList = TODOList
            nextController.userName = firstName
            self.enableButtons()
            self.stopSpinning(activityView: self.activityView)
        }
        if segue.identifier == "toOffTruck"{
            let nextController = segue.destination as! offTruckViewController
            nextController.userName = firstName
            self.enableButtons()
        }
        if segue.identifier == "toScanner"{
            let nextController = segue.destination as! QRScannerController
            nextController.userName = firstName
            self.enableButtons()
        }
        
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        screenFormat()
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    //    MARK: UI FUNCTIONS
    func screenFormat(){
        stopSpinning(activityView: activityView)
        navigationController?.navigationBar.prefersLargeTitles = true
        navigationItem.title = "Welcome " + firstName[0]
//        welcomeUser.text = "Welcome " + firstName
        activeButton.layer.cornerRadius = 40
        activeButton.clipsToBounds = true
        offTruck.layer.cornerRadius = 40
        offTruck.clipsToBounds = true
        todoList.layer.cornerRadius = 40
        todoList.clipsToBounds = true
        qrCode.layer.cornerRadius = 40
        qrCode.clipsToBounds = true
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

    //    MARK: ACTIONS
    @IBAction func scannerClicked(_ sender: Any) {
        self.performSegue(withIdentifier: "toScanner", sender: nil)
    }
    @IBAction func Logout(_ sender: Any) {
        do {
            try Auth.auth().signOut()
            self.performSegue(withIdentifier: "toLogin", sender: nil)
        }catch let error as NSError{
            print("Error signing out: \(error)")
        }
    }
    
    @IBAction func activeClicked(_ sender: Any) {
        disableButtons()
        startSpinning(activityView: activityView)
        getActive(userID: ID, completion: { (activeT) -> Void in
            self.activeTrucks = activeT
            self.performSegue(withIdentifier: "toActive", sender: nil)
        })
       
    }
    @IBAction func offtruckClicked(_ sender: Any) {
        performSegue(withIdentifier: "toOffTruck", sender: nil)
    }
    @IBAction func todoClicked(_ sender: Any) {
        disableButtons()
        startSpinning(activityView: activityView)
        getTODO(userID: ID, completion: {(todo) -> Void in
            self.TODOList = todo
            self.performSegue(withIdentifier: "toToDoList", sender: nil)
        })
    }
        
}
