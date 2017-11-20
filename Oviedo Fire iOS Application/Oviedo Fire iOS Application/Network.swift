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

//////MARK: Structs
//////Structs for the various types of JSON responses

//    Struct for Active List network request
struct active{
    var name: String
    var number: String
    
    init(truckName:String,truckNumber:String) {
        self.name = truckName
        self.number = truckNumber
    }
}
//    Struct for ToDo List network request
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
//    Struct for Compartments List network request
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
//    Struct for various OffTruck List network request
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
//    Struct for a single form, contains a list of Subsections,  which contains a list of items.
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
//    Struct for a single SubSection, contains a list of form items.
struct subSection{
    var title: String
    var formItem: [formItem]
    
    init(title:String, formItem:[formItem]) {
        self.title = title
        self.formItem = formItem
    }
}
//    Struct for a single form entry
struct formItem {
    var caption: String
    var type: String
    var prev: String
    var comment: String
    
    init(caption:String,type:String, prev:String,comment:String) {
        self.caption = caption
        self.type = type
        self.prev = prev
        self.comment = comment
    }
}
//    Struct to save the data that is entered into the form.
struct userResults{
    var value:String
    var note:String
    var type:String
    var caption:String
    var prev: String
    var comment: String
    
    init(value:String,note:String,type:String,caption:String, prev:String,comment:String) {
        self.value = value
        self.note = note
        self.type = type
        self.caption = caption
        self.prev = prev
        self.comment = comment
    }
}
//    Struct for a single result item from the Results network call
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
//    Struct for Compartments List network request, contains a list of subsection
struct resultSection{
    var result: [resultItem]
    init(result:[resultItem]) {
        self.result = result
    }
}
//   Struct storing all the results, contains a list of subsection, which contains a list of items
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
//   Struct to store which path was taken to the form
struct fromWhere{
    var type:String
    var section:String
    
    init(type:String,section:String) {
        self.type = type
        self.section = section
    }
    
}
//    Struct to store the devices current orientation
struct AppUtility {
    static func lockOrientation(_ orientation: UIInterfaceOrientationMask) {
        if let delegate = UIApplication.shared.delegate as? AppDelegate {
            delegate.orientationLock = orientation
        }
    }
    static func lockOrientation(_ orientation: UIInterfaceOrientationMask, andRotateTo rotateOrientation:UIInterfaceOrientation) {
        self.lockOrientation(orientation)
        UIDevice.current.setValue(rotateOrientation.rawValue, forKey: "orientation")
    }
}
//////END Structs

//////Network API URLS:
let getActiveURL = "https://us-central1-oviedofiresd-55a71.cloudfunctions.net/activeVehicles"
let getToDoListURL = "https://us-central1-oviedofiresd-55a71.cloudfunctions.net/toDoList"
let getOffTruckURL = "https://us-central1-oviedofiresd-55a71.cloudfunctions.net/"
let getResultsURL = "https://us-central1-oviedofiresd-55a71.cloudfunctions.net/results"
let checkCompletionURL = "https://us-central1-oviedofiresd-55a71.cloudfunctions.net/checkCompletion"
let resultsURL = "https://us-central1-oviedofiresd-55a71.cloudfunctions.net/results"
let formURL = "https://us-central1-oviedofiresd-55a71.cloudfunctions.net/form"
let compartmentsURL = "https://us-central1-oviedofiresd-55a71.cloudfunctions.net/vehicleCompartments"
//////END URLS:

extension UIViewController{
//////MARK: Alerts
    
    //    Generic Alerts
    func alert(message: String, title: String = ""){
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let okAction = UIAlertAction(title: "Okay", style: UIAlertActionStyle.default)
        alertController.addAction(okAction)
        self.present(alertController, animated: true, completion: nil)
    }
    //    Result of submitting a form
    func sendBackAlert(message: String, title: String = "",completion : @escaping ()->()){
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let okAction = UIAlertAction(title: "Okay", style: UIAlertActionStyle.default){
            UIAlertAction in
            completion()
        }
        alertController.addAction(okAction)
        self.present(alertController, animated: true, completion: nil)
    }
    //    Cancel submitting form alert
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
    //    Submit form alert
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
    //    Okay/Cancel alert for result form alert
    func okayCancelAlert(message: String, title: String = "",completion : @escaping (Bool)->()){
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let submitAction = UIAlertAction(title: "Okay", style: UIAlertActionStyle.default) {
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
//////END ALERTS
    
//////MARK: Helper functions
    //    redirectAfterSubmit:
    //    Converts the struct to users results type
    func redirectAfterSubmit(path:fromWhere,completion : @escaping ([Any])->()){
        let userID:String = (Auth.auth().currentUser?.uid)!
        
        var error:[formItem] = []
        var offTruckItem:[offTruck] = []
        var compartmentList:[compartments] = []
        var TODOList: [toDo] = []
        var resultsForm: [result] = []
        switch path.type {
        case "todo":
            getTODO(userID: userID, completion: { (result) in
                TODOList = result
                completion(TODOList)
            })
        case "offtruck":
            getOffTruck(userID: userID, type: path.section, completion: { (result) in
                offTruckItem = result
                completion(offTruckItem)
            })
        case "compartment":
            getCompartments(singleSelection: path.section, completion: { (result) in
                compartmentList = result
                completion(compartmentList)
            })
        case "results":
            getResults(userID: userID, formId: path.section, completion: { (result) in
                resultsForm.append(result)
                completion(resultsForm)
            })
        default:
            error.append(formItem.init(caption: "error", type: "error", prev: "error", comment: "error"))
            completion(error)
        }
        
    }
    //    createResults:
    //    Converts the struct to users results type
    func createResults(form:completeForm)->([userResults]){
        var list:[userResults] = []
        let subsections = form.subSection
        for items in subsections{
            let sections = items.formItem
            for entry in sections{
                if(entry.type == "pf"){
                    list.append(userResults.init(value: "Fail", note: "", type: entry.type, caption: entry.caption, prev: entry.prev, comment: entry.comment))
                }else{
                    list.append(userResults.init(value: "", note: "", type: entry.type, caption: entry.caption, prev: entry.prev, comment: entry.comment))
                }
            }
        }
        return list
    }
    //    createEditFormResults:
    //    Converts the struct to users results type
    func createEditFormResults(form:completeForm)->([userResults]){
        var list:[userResults] = []
        let subsections = form.subSection
        for items in subsections{
            let sections = items.formItem
            for entry in sections{

                list.append(userResults.init(value: entry.prev, note: entry.comment, type: entry.type, caption: entry.caption, prev: "None", comment: "None" ))
                
            }
        }
        return list
    }
    //    hexStringToUIColor:
    //    Converts hex color to UIColor
    func hexStringToUIColor (hex:String) -> UIColor {
        var cString:String = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        if (cString.hasPrefix("#")) {
            cString.remove(at: cString.startIndex)
        }
        if ((cString.count) != 6) {
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
    
    //    startSpinning:
    //    Unhides and start animating the activity indicator
    func startSpinning(activityView: UIActivityIndicatorView){
        activityView.isHidden = false
        activityView.startAnimating()
    }
    //    stopSpinning:
    //    Hides and stop animating the activity indicator
    func stopSpinning(activityView: UIActivityIndicatorView){
        activityView.isHidden = true
        activityView.stopAnimating()
    }
    //    splitFormTitle:
    //    Parses to form title to contain only the form name, removing the truck name
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
    //    hideKeyboardWhenTappedAround:
    //    dimisses the keyboard when the screen is tapped
    func hideKeyboardWhenTappedAround() {
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(UIViewController.dismissKeyboard))
        tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
    }
    @objc func dismissKeyboard() {
        view.endEditing(true)
    }
//////Ends Misc Helper functions
    
//////MARK: NETWORK FUNCTIONS
    //    getUsername:
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
    //    getActive:
    //    Makes network request to /activeVehicles stores data in active Struct array
    func getActive(userID:String,completion : @escaping ([active])->()){
        var activeTrucks: [active] = []
        activeTrucks.removeAll() //Removes trucks if any
        
        //Parameters to pass with the network request
        let parameters: Parameters = [
            "uid": userID,
        ]
        Alamofire.request(getActiveURL, method: .get, parameters: parameters).responseJSON { response in
            if response.result.value != nil{
                let jsonData = JSON(response.result.value as Any)
                if let arrJSON = jsonData["list"].arrayObject{
                    for index in 0...arrJSON.count-1 {
                        let aObject = arrJSON[index] as! [String : AnyObject]
                        let id = aObject["id"] as? String;
                        let name = aObject["name"] as? String;
                        activeTrucks.append(active(truckName: name!, truckNumber: id!))
                    }
                }
            }else{ //If result value is nil
                self.alert(message: "Error Making Network Request")
                print("Error: \(String(describing: response.error))")
            }
            //Return the active Trucks
            completion(activeTrucks)
        }
    }
    //    getTODO:
    //    Makes network request to /toDoList stores data in todo Struct array
    func getTODO(userID:String,completion : @escaping ([toDo])->()){
        var TODOList: [toDo] = []
        TODOList.removeAll() //Removes all items from the list
        
        //Parameters to pass with the network request
        let parameters: Parameters = [
            "uid": userID,
            ]
        
        Alamofire.request(getToDoListURL, method: .get, parameters: parameters).responseJSON { response in
            if response.result.value != nil{
                let jsonData = JSON(response.result.value as Any)
                if let arrJSON = jsonData["list"].arrayObject{
                    for index in 0...arrJSON.count-1 {
                        let aObject = arrJSON[index] as! [String : AnyObject]
                        let formId = aObject["formId"] as? String;
                        let name = aObject["name"] as? String;
                        let completeBy = aObject["completeBy"] as? String;
                        TODOList.append(toDo(truckName: name!, formId: formId!,completeBy: completeBy!))
                    }
                }
            }else{ //If result value is nil
                self.alert(message: "Error Making Network Request")
                print("Error: \(String(describing: response.error))")
            }
            //Return the active Trucks
            completion(TODOList)
        }
    }

    //    getOffTruck:
    //    Get list the off truck items:
    func getOffTruck(userID:String,type:String,completion : @escaping ([offTruck])->()){
        var offTruckItem:[offTruck] = []
            offTruckItem.removeAll()
        //Parameters to pass with the network request
        let parameters: Parameters = [
            "uid": userID,
            ]
        
        Alamofire.request(getOffTruckURL+"\(type)", method: .get, parameters: parameters).responseJSON { response in
            if response.result.value != nil{
                let jsonData = JSON(response.result.value as Any)
                if let arrJSON = jsonData["list"].arrayObject{
                    for index in 0...arrJSON.count-1 {
                        let aObject = arrJSON[index] as! [String : AnyObject]
                        let formId = aObject["formId"] as? String;
                        let name = aObject["name"] as? String;
                        let completeBy = aObject["completedBy"] as? String;
                        offTruckItem.append(offTruck(name: name!, formId: formId!, completedBy: completeBy!))
                    }
                }
            }else{ //If result value is nil
                self.alert(message: "Error Making Network Request")
                print("Error: \(String(describing: response.error))")
            }
            //Return the active Trucks
            completion(offTruckItem)
        }
    }
    //    checkCompletion:
    //    Checks for form already being completed:
    func checkCompletion(userID:String,formId:String,completion : @escaping (String)->()){
        var isCompleted:String?
        let parameters: Parameters = [
            "uid": userID,
            "formId": formId
            ]
        
        Alamofire.request(checkCompletionURL, parameters: parameters) .responseJSON { response in
            if response.result.value != nil{
                isCompleted = String(data: response.data!, encoding: .utf8)
            }else{ //Print the error
                self.alert(message: "Error Making Network Request")
                print("Error: \(String(describing: response.error))")
                isCompleted = nil
            }
            completion(isCompleted!)
        
        }
    }
    //    getResults:
    //    Gets the results of a completed form:
    func getResults(userID:String,formId:String,completion : @escaping (result)->()){
        
        var resultForm = result.init(completeBy: "Default", timeStamp: "Default", title: "Default", resultSection: [])
        var sections:[resultSection] = []
        var item:[resultItem] = []
        var flag = 0
        
        let parameters: Parameters = [
            "uid": userID,
            "formId": formId
        ]

        Alamofire.request(resultsURL, parameters: parameters) .responseJSON { (response) in
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
                
         
            }else{ //Print the error
                self.alert(message: "Error Making Network Request")
                print("Error: \(String(describing: response.error))")
            }
        completion(resultForm)
        }
    }
    
    //    getForm:
    //    Gets a form
    func getForm(userID:String,formId:String,completion : @escaping (completeForm)->()){
        var form = completeForm(title: "Default", alert: "Default" , subSection: [] )
        var subSectionList:[subSection] = []
        var formItemList:[formItem] = []
        let parameters: Parameters = [
            "uid": userID,
            "formId": formId
        ]
        
        Alamofire.request(formURL, parameters: parameters) .responseJSON { (response) in
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
                    if let prev:String = json["prevCompletedBy"].string,let comment:String = json["prevDate"].string{
                       formItemList.append(formItem.init(caption: json["title"].string!, type: "formTitle", prev: prev, comment: comment))
                    }else{
                        formItemList.append(formItem.init(caption: json["title"].string!, type: "formTitle", prev: "None", comment: "None"))
                    }
                    for (_,subJson) in json["subSections"]{
                        formItemList.append(formItem(caption: subJson["title"].string!,type: "title", prev: "None", comment: "None"))
                        for (_,subsubJson) in subJson["inputElements"]{
                            if let type = subsubJson["type"].string, let caption = subsubJson["caption"].string{
                                if let prev:String = subsubJson["prev"].string{
                                    if let comment:String = subsubJson["prevNote"].string{
                                        formItemList.append(formItem(caption: caption,type: type, prev: prev, comment: comment))
                                    }else{
                                        formItemList.append(formItem(caption: caption,type: type, prev: prev, comment: "None"))
                                    }
                                }else{
                                    formItemList.append(formItem(caption: caption,type: type, prev: "None", comment: "None"))
                                }
                        
                            }
                            
                        }
                        if let title:String = subJson["title"].string{
                            subSectionList.append(subSection(title: title , formItem: formItemList))
                        }else{
                            subSectionList.append(subSection(title: "No Title" , formItem: formItemList))
                        }
                        formItemList.removeAll()
                    }
                    // Adds the Subsections to the struct
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
                    if let prev:String = json["prevCompletedBy"].string,let comment:String = json["prevDate"].string{
                        formItemList.append(formItem.init(caption: json["title"].string!, type: "formTitle", prev: prev, comment: comment))
                    }else{
                        formItemList.append(formItem.init(caption: json["title"].string!, type: "formTitle", prev: "None", comment: "None"))
                    }
                    for (_,subJson) in json["inputElements"]{
                        if let type = subJson["type"].string, let caption = subJson["caption"].string{
                            if let prev:String = subJson["prev"].string{
                                if let comment:String = subJson["prevNote"].string{
                                    formItemList.append(formItem(caption: caption,type: type, prev: prev, comment: comment))
                                }else{
                                    formItemList.append(formItem(caption: caption,type: type, prev: prev, comment: "None"))
                                }
                            }else{
                                formItemList.append(formItem(caption: caption,type: type, prev: "None", comment: "None"))
                            }
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
                
            }else{ //Print the error
                self.alert(message: "Error Making Network Request")
                print("Error: \(String(describing: response.error))")
            }
            
            completion(form)
        
        }
    }
    
    //    getCompartments:
    //    Gets the compartments for a truck
    func getCompartments(singleSelection:String,completion : @escaping ([compartments])->()){
        var list:[compartments] = []
        let userID:String = (Auth.auth().currentUser?.uid)!
        let parameters: Parameters = [
            "uid": userID,
            "vehicleId": singleSelection
        ]
        
        Alamofire.request(compartmentsURL, parameters:parameters) .responseJSON { response in
            if let result = response.result.value as? [String:Any],
                let main = result["list"] as? [[String:String]]{
                for obj in main{
                    list.append(compartments(formName: obj["name"]!, formId: obj["formId"]!, completedBy: obj["completedBy"]!))
                    
                }
            }else{ //Print the error
                self.alert(message: "Error Making Network Request")
                print("Error: \(String(describing: response.error))")
            }
            completion(list)
        }
    }
    
    //    sendForm:
    //    Sends a complete form
    func sentForm(json:[String:Any],completion : @escaping (Bool)->()){
        var flag = false
        Alamofire.request(formURL, method: .post, parameters: json, encoding: JSONEncoding.default).response {  response in
            let isSubmitted = String(data: response.data!, encoding: .utf8)
            if(isSubmitted == "OK" || isSubmitted?.lowercased() == "ok"){
                flag = true
            }else{ //Print the error
                self.alert(message: "Error Making Network Request")
                print("Error: \(String(describing: response.error))")
            }
            completion(flag)
        }
    }
//////END NETWORK FUNCTIONS
}


