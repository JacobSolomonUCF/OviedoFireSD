//
//  toDoViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 10/1/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit
import Alamofire
import Firebase

class toDoViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
   
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    
    var form: [formItem] = []
    var list: [toDo] = []
    let userID = Auth.auth().currentUser!.uid
    var singleFormId:String = ""
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.tableView?.rowHeight = 70.0
        activityView.isHidden = true

//         Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
//         Dispose of any resources that can be recreated.
    }
    
//         Prepare for Segues
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toForm"{
            let nextController = segue.destination as! EqFormViewController
            nextController.form = form
            
        }
    }
    
//    Table Functions
//    List item is tapped
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        print(list[indexPath.row])
        activityView.isHidden = false
        activityView.startAnimating()
        singleFormId = list[indexPath.row].formId
        
        getForm(userID: userID, formId: singleFormId, completion: {
            self.performSegue(withIdentifier: "toForm", sender: nil)
            
        })
    
        

    }
    
//    Number of cells
    func tableView(_ tableView:UITableView, numberOfRowsInSection section:Int) -> Int
    {
        return list.count
    }

    
    
    
//    Cell formatting
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath) as! toDoListTableViewCell
        let fullName:String = list[indexPath.row].name
        var fIndex = fullName.endIndex
        var sIndex = fullName.index(of:"-") ?? fullName.endIndex

        if(fullName.contains("/")){                 //For the default case
            fIndex = fullName.index(of:"/") ?? fullName.endIndex
            sIndex = fullName.index(sIndex, offsetBy: 2)
        }else if(!fullName.contains(" - ")){        //For the case with no name at all
            fIndex = fullName.endIndex
            sIndex = fullName.startIndex
        }else{                                      //For the case with no second name 
            fIndex = fullName.index(of:"-") ?? fullName.endIndex
            sIndex = fullName.index(sIndex, offsetBy: 2)
        }
        
        //Parsing the string
        var firstName = String(fullName[..<fIndex])
        let formName = String(fullName[sIndex...])
        if(formName == firstName){
            firstName = " "
        }
        //Sets the views labels
        cell.formName.text = formName
        cell.vehicleName.text = firstName
        cell.completeBy.text = "Complete by " + list[indexPath.row].completeBy
        return cell
    }
//    END Table Function
    
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