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
    var form:[formItem] = []
    var singleFormId:String = ""
    var type:String = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupView()

    }
    
    func setupView(){
        stopSpinning(activityView: activityView)
        
        navigationItem.title = type
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        if segue.identifier == "toForm"{
            let nextController = segue.destination as! EqFormViewController
            nextController.formId = singleFormId
            
        }
        stopSpinning(activityView: activityView)
    }
}

extension offTruckListViewController{
    //List item is tapped
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {

        startSpinning(activityView: activityView)
        singleFormId = list[indexPath.row].formId
        
        performSegue(withIdentifier: "toForm", sender: nil)
        
        
        
    }
    
    //Number of cells
    func tableView(_ tableView:UITableView, numberOfRowsInSection section:Int) -> Int
    {
        return list.count
    }
    
    
    //Cell formatting
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        let cell:UITableViewCell=UITableViewCell(style: UITableViewCellStyle.subtitle, reuseIdentifier: "cell")
        cell.backgroundColor = UIColor.clear
        tableView.backgroundColor = UIColor.clear
        cell.textLabel?.text = list[indexPath.row].name
        cell.detailTextLabel?.text = "Completed By: " + list[indexPath.row].completedBy
        
        
        return cell
    }
}
