//
//  CompartmentsViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 9/20/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit
import Firebase
import Alamofire

class CompartmentsViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    @IBOutlet weak var tableView: UITableView!
    
    var form: [formItem] = []
    var list: [compartments] = []
    let userID = Auth.auth().currentUser!.uid
    
    
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
    
    
    //Prepare for segue
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        if segue.identifier == "toForm"{
            let nextController = segue.destination as! EqFormViewController
            nextController.form = form
            
        }
    }
    
    
    
    //Table Functions
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        //print(list[indexPath.row])
        activityView.isHidden = false
        activityView.startAnimating()
        tableView.allowsSelection = false
        
        getForm(userID: userID, formId: list[indexPath.row].formId, completion: {
            print(self.form)
            self.performSegue(withIdentifier: "toForm", sender: nil)
            self.activityView.stopAnimating()
            self.activityView.isHidden = true
            tableView.allowsSelection = true
            })
    
        

        
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
    //End Table Functions

    func getForm(userID:String,formId:String,completion : @escaping ()->()){
        
        if(form.count != 0){
            form.removeAll()
        }
        
        
        Alamofire.request("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/form?uid=\(userID)&formId=\(formId)") .responseJSON { response in
            if let result = response.result.value as? [String:Any],
                let main = result["inputElements"] as? [[String:String]]{
                // main[0]["name"] or use main.first?["name"] for first index or loop through array
                for obj in main{
                    self.form.append(formItem(caption: obj["caption"]!, type: obj["type"]!))
                }
            }
            completion()
        }
    }
    

}
