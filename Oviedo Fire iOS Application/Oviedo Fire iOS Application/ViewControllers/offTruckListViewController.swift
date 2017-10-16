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


class offTruckListViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    @IBOutlet weak var backgroundImage: UIImageView!
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    
    let userID = Auth.auth().currentUser!.uid
    var list:[offTruck] = []
    var form = completeForm(title: "Default", alert: "Default" , subSection: [] )
    var singleFormId:String = ""
    var type:String = ""
    var formName:String = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupView()

    }
    
    func setupView(){
        stopSpinning(activityView: activityView)
        self.tableView?.rowHeight = 70.0
        navigationItem.title = type
        switch type {
        case "Stretchers":
            backgroundImage.image = UIImage(named: "Learning and Leading.jpg")
        case "Ladders":
            backgroundImage.image = UIImage(named: "Lush.jpg")
        case "Misc.":
            backgroundImage.image = UIImage(named: "Amethyst.jpg")
        case "Scbas":
            backgroundImage.image = UIImage(named: "YouTube.jpg")
        default:
            print("NO IMAGE")
        }
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        if segue.identifier == "toForm"{
            let nextController = segue.destination as! EqFormViewController
            nextController.formId = singleFormId
            nextController.form = form
            nextController.formName = formName
            
        }
        stopSpinning(activityView: activityView)
    }
}

extension offTruckListViewController{
    //List item is tapped
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {

        startSpinning(activityView: activityView)
        singleFormId = list[indexPath.row].formId
        formName = list[indexPath.row].name
        
        getForm(userID: userID, formId: singleFormId) { (list) in
            self.form = list
            self.performSegue(withIdentifier: "toForm", sender: nil)
            
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