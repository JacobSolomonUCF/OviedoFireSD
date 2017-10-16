//
//  Network.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 9/20/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit
import Firebase
import Alamofire
import SwiftyJSON

//    MARK: Structs
//    Structs for the various types of JSON responses
struct active{
    var name: String
    var number: String
    
    init(truckName:String,truckNumber:String) {
        self.name = truckName
        self.number = truckNumber
    }
}
struct toDo{
    var name: String
    var formId: String
    var completeBy: String
    
    init(truckName:String,formId:String, completeBy:String) {
        self.name = truckName
        self.formId = formId
        self.completeBy = completeBy
    }
}
struct compartments {
    var formName: String
    var formId: String
    var completeBy: String
    
    init(formName:String,formId:String,completedBy:String) {
        self.completeBy = completedBy
        self.formId = formId
        self.formName = formName
    }
}
struct completeForm{
    var title:String
    var alert:String
    var subSection:[subSection]
    
    init(title:String, alert:String, subSection:[subSection]) {
        self.title = title
        self.alert = alert
        self.subSection = subSection
    }
}

struct formItem {
    var caption: String
    var type: String

    
    init(caption:String,type:String) {
        self.caption = caption
        self.type = type
    }
}
struct subSection{
    var title: String
    var formItem: [formItem]
    
    init(title:String, formItem:[formItem]) {
        self.title = title
        self.formItem = formItem
    }
}

struct offTruck{
    var name: String
    var formId: String
    var completedBy: String
    
    init(name:String,formId:String, completedBy:String) {
        self.name = name
        self.formId = formId
        self.completedBy = completedBy
    }
}
//    End Structs

extension UIViewController{

    func alert(message: String, title: String = "") {
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let OKAction = UIAlertAction(title: "OK", style: .default, handler: nil)
        alertController.addAction(OKAction)
        self.present(alertController, animated: true, completion: nil)
    }

    //    Help functions to load/unload activity view
    func startSpinning(activityView: UIActivityIndicatorView){
        activityView.isHidden = false
        activityView.startAnimating()
    }
    func stopSpinning(activityView: UIActivityIndicatorView){
        activityView.isHidden = true
        activityView.stopAnimating()
    }
    
    
    //    MARK: NETWORK FUNCTIONS
    
    //    Gets the username of the current user
    func getUsername(userID:String,completion : @escaping (String)->()){
        var firstName:String = "NONE"
        Alamofire.request("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/userInfo?uid=\(userID)") .responseJSON { response in
            if let result = response.result.value as? [String:Any]{
                firstName = result["firstName"] as! String
            }
            completion(firstName)
        }
    }
    //    Gets Active Items:
    func getActive(userID:String,completion : @escaping ([active])->()){
        
        var activeTrucks: [active] = []
        if(activeTrucks.count != 0){
            activeTrucks.removeAll()
        }
        
        Alamofire.request("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/activeVehicles?uid=\(userID)") .responseJSON { response in
            if let result = response.result.value as? [String:Any],
                let main = result["list"] as? [[String:String]]{
                for obj in main{
                    activeTrucks.append(active(truckName: obj["name"]!, truckNumber: obj["id"]!))
                }
            }
            completion(activeTrucks)
        }
    }
    
    //     Gets the TODO List:
    func getTODO(userID:String,completion : @escaping ([toDo])->()){
        var TODOList: [toDo] = []
        if(TODOList.count != 0){
            TODOList.removeAll()
        }
        Alamofire.request("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/toDoList?uid=\(userID)") .responseJSON { response in
            if let result = response.result.value as? [String:Any],
                let main = result["list"] as? [[String:String]]{
                // main[0]["name"] or use main.first?["name"] for first index or loop through array
                for obj in main{
                    TODOList.append(toDo(truckName: obj["name"]!, formId: obj["formId"]!,completeBy: obj["completeBy"]!))
                }
            }
            completion(TODOList)
        }
    }
    
    //    Get list of off truck items:
    func getOffTruck(userID:String,type:String,completion : @escaping ([offTruck])->()){
        var offTruckItem:[offTruck] = []
        
        if(offTruckItem.count != 0){
            offTruckItem.removeAll()
        }
        
        print(userID)
        print(type)
        Alamofire.request("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/\(type)?uid=\(userID)") .responseJSON { response in
            if let result = response.result.value as? [String:Any],
                let main = result["list"] as? [[String:String]]{
                // main[0]["name"] or use main.first?["name"] for first index or loop through array
                for obj in main{
                    offTruckItem.append(offTruck(name: obj["name"]!, formId: obj["formId"]!, completedBy: obj["completedBy"]!))
                }
            }
            
            completion(offTruckItem)
        }
    }
    
    //    Checks for form already being completed:
    func checkCompletion(userID:String,formId:String,completion : @escaping (String)->()){
        Alamofire.request("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/checkCompletion?uid=\(userID)&formId=\(formId)") .responseJSON { response in
            let isCompleted = String(data: response.data!, encoding: .utf8)
            completion(isCompleted!)
            }
        
        }
    
    //    Gets the form:
    func getForm(userID:String,formId:String,completion : @escaping (completeForm)->()){
        
        var form = completeForm(title: "Default", alert: "Default" , subSection: [] )
        var subSectionList:[subSection] = []
        var formItemList:[formItem] = []
        
        Alamofire.request("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/form?uid=\(userID)&formId=\(formId)") .responseJSON { (response) in
            if((response.result.value) != nil){
                let json = JSON(response.result.value!)
                if(json["subSections"].exists()){
                    for (_,subJson) in json["subSections"]{
                        formItemList.append(formItem(caption: subJson["title"].string!,type: "title"))
                        for (_,subsubJson) in subJson["inputElements"]{
                            if let type = subsubJson["type"].string, let caption = subsubJson["caption"].string{
                                formItemList.append(formItem(caption: caption,type: type))
                            }
                            
                        }
                        if let title:String = subJson["title"].string{
                            subSectionList.append(subSection(title: title , formItem: formItemList))
                        }else{
                            subSectionList.append(subSection(title: "No Title" , formItem: formItemList))
                        }
                        formItemList.removeAll()
                    }
//                  Adds the Subsections to the struct
                    if let title:String = json["title"].string, let alert:String = json["alert"].string{
                        form.alert = alert
                        form.title = title
                        form.subSection = subSectionList
                    }else{
                        form.alert = "No Alert"
                        form.title = "No Title"
                        form.subSection = subSectionList
                    }
                    
                    
                }else{
                    formItemList.append(formItem(caption: json["title"].string!,type: "title"))
                    for (_,subJson) in json["inputElements"]{
                        if let type = subJson["type"].string, let caption = subJson["caption"].string{
                            formItemList.append(formItem(caption: caption, type:type))
                        }
                    }
                    subSectionList.append(subSection(title: json["title"].string! , formItem: formItemList))
                    form.alert = "No Alert"
                    form.title = "Single Section"
                    form.subSection = subSectionList
                    formItemList.removeAll()
                }
                
            }
            
            completion(form)
            
           /* if let result = response.result.value as? [String:Any],
                let main = result["inputElements"] as? [[String:String]]{
                // main[0]["name"] or use main.first?["name"] for first index or loop through array
                for obj in main{
                    form.append(formItem(caption: obj["caption"]!, type: obj["type"]!, title: "TEST"))
                    
                }
                
            }
            completion(form)*/
        }
    }
    
    //    Get Compartments:
    func getCompartments(singleSelection:String,completion : @escaping ([compartments])->()){
        var list:[compartments] = []
        
        let userID:String = (Auth.auth().currentUser?.uid)!
        
        Alamofire.request("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/vehicleCompartments?uid=\(userID)&vehicleId=\(singleSelection)") .responseJSON { response in
            if let result = response.result.value as? [String:Any],
                let main = result["list"] as? [[String:String]]{
                // main[0]["name"] or use main.first?["name"] for first index or loop through array
                for obj in main{
                    list.append(compartments(formName: obj["name"]!, formId: obj["formId"]!, completedBy: obj["completedBy"]!))
                    
                }
            }
            completion(list)
        }
    }
    
    
    
    

}
