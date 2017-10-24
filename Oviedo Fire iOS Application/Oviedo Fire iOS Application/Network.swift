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
struct userResults{
    var value:String
    var note:String
    var type:String
    var caption:String
    
    init(value:String,note:String,type:String,caption:String) {
        self.value = value
        self.note = note
        self.type = type
        self.caption = caption
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
struct resultItem {
    var caption: String
    var value: String
    var type: String
    var comment: String
    
    init(caption:String, value:String, type:String, comment:String) {
        self.caption = caption
        self.value = value
        self.type = type
        self.comment = comment
    }
}

struct resultSection{
    var result: [resultItem]
    init(result:[resultItem]) {
        self.result = result
    }
}

struct result{
    var completedBy: String
    var timeStamp: String
    var title: String
    var resultSection: [resultSection]
    
    init(completeBy:String,timeStamp:String,title:String,resultSection:[resultSection]) {
        self.completedBy = completeBy
        self.timeStamp = timeStamp
        self.title = title
        self.resultSection = resultSection
    }
}

struct fromWhere{
    var type:String
    var section:String
    
    init(type:String,section:String) {
        self.type = type
        self.section = section
    }
    
}
struct AppUtility {
    
    static func lockOrientation(_ orientation: UIInterfaceOrientationMask) {
        
        if let delegate = UIApplication.shared.delegate as? AppDelegate {
            delegate.orientationLock = orientation
        }
    }
    
    /// OPTIONAL Added method to adjust lock and rotate to the desired orientation
    static func lockOrientation(_ orientation: UIInterfaceOrientationMask, andRotateTo rotateOrientation:UIInterfaceOrientation) {
        
        self.lockOrientation(orientation)
        
        UIDevice.current.setValue(rotateOrientation.rawValue, forKey: "orientation")
    }
    
}

//    End Structs

extension UIViewController{
    
    func alert(message: String, title: String = ""){
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let okAction = UIAlertAction(title: "Ok", style: UIAlertActionStyle.default)
        alertController.addAction(okAction)
        self.present(alertController, animated: true, completion: nil)
    }
    func sendBackAlert(message: String, title: String = "",completion : @escaping ()->()){
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let okAction = UIAlertAction(title: "Ok", style: UIAlertActionStyle.default){
            UIAlertAction in
            completion()
        }
        alertController.addAction(okAction)
        self.present(alertController, animated: true, completion: nil)
    }
    func cancelForm(message: String, title: String = "",completion : @escaping (Bool)->()){
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let submitAction = UIAlertAction(title: "Leave", style: UIAlertActionStyle.default) {
            UIAlertAction in
            completion(true)
        }
        let cancelAction = UIAlertAction(title: "Cancel", style: UIAlertActionStyle.default) {
            UIAlertAction in
            completion(false)
        }
        alertController.addAction(submitAction)
        alertController.addAction(cancelAction)
        self.present(alertController, animated: true, completion: nil)
    }

    func submitAlert(message: String, title: String = "",completion : @escaping (Bool)->()){
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let submitAction = UIAlertAction(title: "Submit", style: UIAlertActionStyle.default) {
            UIAlertAction in
            completion(true)
        }
        let cancelAction = UIAlertAction(title: "Cancel", style: UIAlertActionStyle.default) {
            UIAlertAction in
            completion(false)
        }
        alertController.addAction(submitAction)
        alertController.addAction(cancelAction)
        self.present(alertController, animated: true, completion: nil)
    }
    func createResults(form:completeForm)->([userResults]){
        var list:[userResults] = []
        let subsections = form.subSection
        for items in subsections{
            let sections = items.formItem
            for entry in sections{
                if(entry.type == "pf"){
                    list.append(userResults.init(value: "Fail", note: "", type: entry.type, caption: entry.caption))
                }else{
                    list.append(userResults.init(value: "", note: "", type: entry.type, caption: entry.caption))
                }
            }
        }
        return list
    }
    func hexStringToUIColor (hex:String) -> UIColor {
        var cString:String = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        
        if (cString.hasPrefix("#")) {
            cString.remove(at: cString.startIndex)
        }
        
        if ((cString.characters.count) != 6) {
            return UIColor.gray
        }
        
        var rgbValue:UInt32 = 0
        Scanner(string: cString).scanHexInt32(&rgbValue)
        
        return UIColor(
            red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
            green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
            blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
            alpha: CGFloat(1.0)
        )
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
    func splitFormTitle(formTitle:String) -> [String]{
        var names:[String] = []
        
        if(formTitle.contains("Check-Off") || !formTitle.contains(" - ")){
            names.append("Other")
            names.append(formTitle)
        }else{
            var split = formTitle.components(separatedBy: " - ")
            names.append(split[0])
            names.append(split[1])
        }
        
        return names
    }
    func hideKeyboardWhenTappedAround() {
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(UIViewController.dismissKeyboard))
        tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
    }
    
    @objc func dismissKeyboard() {
        view.endEditing(true)
    }
    
    
    
    //    MARK: NETWORK FUNCTIONS
    
    //    Gets the username of the current user
    func getUsername(userID:String,completion : @escaping ([String])->()){
        var firstName:[String] = []
        Alamofire.request("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/userInfo?uid=\(userID)") .responseJSON { response in
            if let result = response.result.value as? [String:Any]{
                firstName.append(result["firstName"] as! String)
                firstName.append(result["lastName"] as! String)
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
    
    //    Gets the results:
    func getResults(userID:String,formId:String,completion : @escaping (result)->()){
        
        var resultForm = result.init(completeBy: "Default", timeStamp: "Default", title: "Default", resultSection: [])
        var sections:[resultSection] = []
        var item:[resultItem] = []
        var flag = 0
        
        
        Alamofire.request("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/results?uid=\(userID)&formId=\(formId)") .responseJSON { (response) in
            if((response.result.value) != nil){
                let json = JSON(response.result.value!)
                resultForm.completedBy = json["completedBy"].string!
                resultForm.timeStamp = json["datestamp"].string!
                resultForm.title = json["title"].string!
                
                item.append(resultItem.init(caption: resultForm.completedBy , value: resultForm.timeStamp, type: "title", comment: resultForm.title))
                for(_,subJson) in json["results"]{
                    if(subJson["results"].exists()){
                        item.append(resultItem.init(caption: subJson["title"].string!, value: "None", type: "sectionTitle", comment: "No Comment"))
                        for(_,subsubJson) in subJson["results"]{
                            let caption = subsubJson["caption"].string!
                            var resultValue:String = ""
                            if (subsubJson["result"].exists()){
                                resultValue = subsubJson["result"].string!
                            }else if(subsubJson["status"].exists()){
                                resultValue = subsubJson["status"].string!
                            }else{
                                print("ERROR")
                            }
                            let type = subsubJson["type"].string!
                            var comment:String
                            if subsubJson["note"].exists(){
                                comment = subsubJson["note"].string!
                            }else{
                                comment = "No Comment"
                            }
                            item.append(resultItem.init(caption: caption, value: resultValue, type: type, comment: comment))
                            
                        }
                        sections.append(resultSection.init(result: item))
                        item.removeAll()
                        
                    }else{
                        flag = 1
                        let caption = subJson["caption"].string!
                        let type = subJson["type"].string!
                        var comment:String
                        var resultValue:String = ""
                        if (subJson["result"].exists()){
                            resultValue = subJson["result"].string!
                        }else if(subJson["status"].exists()){
                            resultValue = subJson["status"].string!
                        }else{
                            print("ERROR")
                        }
                        
                        if subJson["note"].exists(){
                            comment = subJson["note"].string!
                        }else{
                            comment = "No Comment"
                        }
                        item.append(resultItem.init(caption: caption, value: resultValue, type: type, comment: comment))
                    }
                }
                if(flag == 1){
                    sections.append(resultSection.init(result: item))
                }
                resultForm.resultSection = sections
                
         
            }else{
                self.alert(message: "Error connecting to the server")
            }
            completion(resultForm)
        }
        
        
    }
    
    
    //    Gets the form:
    func getForm(userID:String,formId:String,completion : @escaping (completeForm)->()){
        
        var form = completeForm(title: "Default", alert: "Default" , subSection: [] )
        var subSectionList:[subSection] = []
        var formItemList:[formItem] = []
        
        Alamofire.request("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/form?uid=\(userID)&formId=\(formId)") .responseJSON { (response) in
            let isCompleted = String(data: response.data!, encoding: .utf8)
            if (isCompleted?.contains("does not exist") == true){
                    print("FORM NOT FOUND")
                    form.title = "No Form Found"
                    form.alert = "No Form Found"
                    completion(form)
                }
            
            if((response.result.value) != nil){
                let json = JSON(response.result.value!)
                if(json["subSections"].exists()){
                    formItemList.append(formItem.init(caption: json["title"].string!, type: "formTitle"))
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
                    formItemList.append(formItem(caption: json["title"].string!,type: "formTitle"))
                    for (_,subJson) in json["inputElements"]{
                        if let type = subJson["type"].string, let caption = subJson["caption"].string{
                            formItemList.append(formItem(caption: caption, type:type))
                        }
                    }
                    subSectionList.append(subSection(title: "N/A" , formItem: formItemList))
                    if let title:String = json["title"].string, let alert:String = json["alert"].string{
                        form.alert = alert
                        form.title = title
                        form.subSection = subSectionList
                    }else{
                        form.alert = "No Alert"
                        form.title = "No Title"
                        form.subSection = subSectionList
                    }

                    form.subSection = subSectionList
                    formItemList.removeAll()
                }
                
            }
            
            completion(form)
        
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
    
    //    POST FORM:
    func sentForm(json:[String:Any],completion : @escaping (Bool)->()){
        let urlString = "https://us-central1-oviedofiresd-55a71.cloudfunctions.net/form"
        var flag = false
        Alamofire.request(urlString, method: .post, parameters: json, encoding: JSONEncoding.default).response {  response in
            let isSubmitted = String(data: response.data!, encoding: .utf8)
            if(isSubmitted == "OK"){
                flag = true
            }
            completion(flag)
        }
        
    }
    
}
extension UIViewController {
    func performSegueToReturnBack()  {
        if let nav = self.navigationController {
            nav.popViewController(animated: true)
        } else {
            self.dismiss(animated: true, completion: nil)
        }
    }
}

