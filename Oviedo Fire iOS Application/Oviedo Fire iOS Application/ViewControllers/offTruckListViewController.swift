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
    
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    
    let userID = Auth.auth().currentUser!.uid
    var list:[offTruck] = []
    var form:[formItem] = []
    var singleFormId:String = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        stopSpinning(activityView: activityView)

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
    }
}

extension offTruckListViewController{
    //List item is tapped
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        print(list[indexPath.row])
        activityView.isHidden = false
        activityView.startAnimating()
        singleFormId = list[indexPath.row].formId
        
        
        activityView.isHidden = true
        activityView.stopAnimating()
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
        cell.textLabel?.text = list[indexPath.row].name
        cell.detailTextLabel?.text = "Completed By: " + list[indexPath.row].completedBy
        
        
        return cell
    }
}
