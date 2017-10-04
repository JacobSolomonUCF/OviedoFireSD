//
//  toDoViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 10/1/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit

class toDoViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
   
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    
    
    var list: [toDo] = []
    var singleFormId:String = ""
    
    override func viewDidLoad() {
        activityView.isHidden = true
        
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    //Prepare for Segues
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toForm"{
            let nextController = segue.destination as! EqFormViewController
            nextController.formId = singleFormId
            
        }
    }
    
    /////Table Functions
    //List item is tapped
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        print(list[indexPath.row])
        activityView.isHidden = false
        activityView.startAnimating()
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
        cell.textLabel?.text = list[indexPath.row].name
        cell.detailTextLabel?.text = "Complete By: " + list[indexPath.row].completeBy
        
        
        return cell
    }
    /////END Table Function

}
