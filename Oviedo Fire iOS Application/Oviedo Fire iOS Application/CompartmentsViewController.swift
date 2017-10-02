//
//  CompartmentsViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 9/20/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit
import Alamofire
import Firebase

class CompartmentsViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    @IBOutlet weak var tableView: UITableView!
    
    var list: [compartments] = []
    var singleFormId:String = ""
    
    
    override func viewWillDisappear(_ animated : Bool) {
        super.viewWillDisappear(animated)
        
        if self.isMovingFromParentViewController {
            list.removeAll()
            print(list.count)
            tableView.reloadData()

        }
    }
    
    override func viewDidLoad() {
        activityView.isHidden = true
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }
    

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        print(list[indexPath.row])
        activityView.isHidden = false
        activityView.startAnimating()
        tableView.allowsSelection = false
        
        singleFormId = list[indexPath.row].formId
        
        performSegue(withIdentifier: "toForm", sender: nil)
        activityView.stopAnimating()
        activityView.isHidden = true
        tableView.allowsSelection = true
        
    }
    
    func tableView(_ tableView:UITableView, numberOfRowsInSection section:Int) -> Int
    {
        return list.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        let cell:UITableViewCell=UITableViewCell(style: UITableViewCellStyle.subtitle, reuseIdentifier: "compartmentsCell")
        cell.textLabel?.text = list[indexPath.row].truckname
        cell.detailTextLabel?.text =  list[indexPath.row].completeBy
        
        
        return cell
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        if segue.identifier == "toForm"{
            let nextController = segue.destination as! EqFormViewController
            nextController.formId = singleFormId
            
        }
    }

    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
