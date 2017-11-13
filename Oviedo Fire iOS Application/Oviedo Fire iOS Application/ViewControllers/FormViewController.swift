//
//  EqFormViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 9/15/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit
import DLRadioButton
import Firebase
import SwiftyJSON


struct formSaved {
    var commentField:String
    var pmrSelection:Int
    var rowIndex:Int
    
    init(commentField:String,pmrSelection:Int, rowIndex:Int) {
        self.commentField = commentField
        self.pmrSelection = pmrSelection
        self.rowIndex = rowIndex
    }
    
}

class EqFormViewController: UIViewController, UITableViewDelegate, UITableViewDataSource{
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    
    var expandedRows = Set<Int>()
    
    let userID = Auth.auth().currentUser!.uid
    
    var commingFrom:fromWhere = fromWhere.init(type: "Default", section: "Default")
    var formName = ""
    var formId:String = ""
    var form = completeForm(title: "Default", alert: "Default" , subSection: [] )
    var selectedIndex:Int = 0
    var userName:[String] = []
    var userEnteredResults:[userResults] = []
    
    func setupView(){
        stopSpinning(activityView: activityView)
        
        //Displaying alert with a give form
        if form.alert != "No Alert" {
            alert(message: form.alert)
        }
        
        self.hideKeyboardWhenTappedAround()
        navigationController?.navigationBar.prefersLargeTitles = false
        navigationItem.title = ""
        tableView.estimatedRowHeight = 100
        tableView.rowHeight = UITableViewAutomaticDimension
        self.tableView.delegate = self
        self.tableView.dataSource = self
        
        self.navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Cancel", style: .done, target: self, action: #selector(self.back(sender:)))
    }
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toHome"{
            let nextController = segue.destination as! HomeViewController
            nextController.firstName = userName
        }
        tableView.isUserInteractionEnabled = true
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupView()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    @objc func back(sender: AnyObject) {
        cancelForm(message: "You will lose all progress if you leave this page, would you still like to leave?") { (result) in
            if(result == true){
                self.navigationController?.popViewController(animated: true)
            }
        }
    }
    
    func formCount() -> Int{
        var count = 0
        let subsections = form.subSection
        for items in subsections{
            let sections = items.formItem
            for _ in sections{
                count += 1
            }
        }
        return count
    }
    
    func findItem(index:Int, form:completeForm) -> formItem{
        var item = formItem.init(caption: "NA", type: "NA", prev: "NA", comment: "NA")
        
        var count = 0
        let subsections = form.subSection
        for items in subsections{
            let sections = items.formItem
            for row in sections{
                if(index == count){
                    item.comment = row.comment
                    item.prev = row.prev
                    item.caption = row.caption
                    item.type = row.type
                    return item
                }
                count += 1
            }
        }
        return item
    }
    
    func checkForm()->(Int){
        var numberNotCompleted = 0;
        var commentflag = 0;
        
        checkCompletion(userID: userID, formId: formId, completion: { (result) in
            if(result == "true"){
                commentflag = 2
            }
        })
        if commentflag == 2{
            return 2
        }
        
        
        for items in userEnteredResults{
            if !(items.type.contains("title") || items.type.contains("formTitle")){
                if(items.value == ""){
                    numberNotCompleted += 1
                }
                if(items.type == "pmr" && items.note == "" && items.value == "Repairs Needed"){
                    commentflag = 1
                }
            }
        }
        
        if(commentflag == 1){
            return -1
        }
        if(numberNotCompleted == 0){
            return 1
        }
    
        return 0
    
    }
    
    func toJsonSingle()->([String:Any]){

        var myJSON: [String:Any] = [
            "uid" : "\(userID)",
            "formId" : "\(formId)",
            "results" : []
        ]
        for items in userEnteredResults{
            if(items.type != "formTitle"){
                if(items.type != "title"){
                    var item:[String:Any]
                    if(items.type == "pmr" && items.note != "" && items.value == "Repairs Needed"){
                        item = ["caption":"\(items.caption)","type":"\(items.type)","result":"\(items.value)","note":"\(items.note)"]
                    }else{
                        item = ["caption":"\(items.caption)","type":"\(items.type)","result":"\(items.value)"]
                    }
                    // get existing items, or create new array if doesn't exist
                    var existingItems = myJSON["results"] as? [[String: Any]] ?? [[String: Any]]()
                    
                    // append the item
                    existingItems.append(item)
                    
                    // replace back into `data`
                    myJSON["results"] = existingItems
                }
            }
        }
        return myJSON
    }
    func toJsonMulti()->([String:Any]){
        
        var myJSON:[String:Any] = [
            "uid" : "\(userID)",
            "formId" : "\(formId)",
            "results" : []
        ]
        var single: [String:Any] = [
            "title" : "",
            "results" : []
        ]
        var i = 0
        var title = ""
        for items in userEnteredResults{
            
            if(items.type != "formTitle"){
                if(items.type != "title"){
                    var item:[String:Any]
                    if(items.type == "pmr" && items.note != "" && items.value == "Repairs Needed"){
                        item = ["caption":"\(items.caption)","type":"\(items.type)","result":"\(items.value)","note":"\(items.note)"]
                    }else{
                        item = ["caption":"\(items.caption)","type":"\(items.type)","result":"\(items.value)"]
                    }
                    // get existing items, or create new array if doesn't exist
                    var existingItems = single["results"] as? [[String: Any]] ?? [[String: Any]]()
                    
                    // append the item
                    existingItems.append(item)
                    
                    // replace back into `data`
                     single["results"] = existingItems
                    
                    
                }else{
                    if(i > 1){
                        single["title"] = title
                        title = ""

                        
                        var existingItems = myJSON["results"] as? [[String: Any]] ?? [[String: Any]]()
                        // append the item
                        existingItems.append(single)
                        
                        // replace back into `data`
                        myJSON["results"] = existingItems
                        
                        single = [
                            "title" : "",
                            "results" : []
                        ]
                    }
                    title = items.caption
                }
            }
            i += 1
        }
        single["title"] = title
        
        var existingItems = myJSON["results"] as? [[String: Any]] ?? [[String: Any]]()
        // append the item
        existingItems.append(single)
        
        // replace back into `data`
        myJSON["results"] = existingItems
        
//        print(myJSON)
        return myJSON
    }
    
    func back(){
        if self.presentingViewController != nil {
            self.dismiss(animated: false, completion: {
                self.navigationController!.popToRootViewController(animated: true)
            })
        }
        else {
            self.navigationController!.popToRootViewController(animated: true)
        }
        
        /*switch commingFrom.type {
        case "qr":
            let qrController = QRScannerController()
            self.present(qrController, animated: true, completion: nil)
        case "offtruck":
            let offtruckController = offTruckListViewController()
            self.present(offtruckController, animated: true, completion: nil)
        case "todo":
            let todoController = toDoViewController()
            self.present(todoController, animated: true, completion: nil)
            
        default:
            print("Error")
        }*/
        
    }

    
    
    //    MARK: Button Actions
    
    @objc func needsRepairbuttonClicked(sender:UIButton) {
        let indexPath = IndexPath(row: sender.tag , section: 0)
        let buttonRow = sender.tag
        userEnteredResults[sender.tag].value = "Repairs Needed"
        
        let entry = findItem(index: buttonRow, form: form)
        if (entry.type == "pmr"){
            guard let cell = tableView.cellForRow(at: indexPath) as? FormTableViewCell
                else { return }
            if (!cell.isExpanded){
                self.expandedRows.insert(buttonRow)
            }else{return}
            cell.isExpanded = !cell.isExpanded
            cell.presentButton.isUserInteractionEnabled = true
            cell.missingButton.isUserInteractionEnabled = true
            cell.needsRepairButton.isUserInteractionEnabled = false
            self.tableView.beginUpdates()
            self.tableView.endUpdates()
            
        }
        
    }
    @objc func missingbuttonClicked(sender:UIButton) {
        let indexPath = IndexPath(row: sender.tag , section: 0)
        let buttonRow = sender.tag
        userEnteredResults[sender.tag].value = "Missing"
        
        let entry = findItem(index: buttonRow, form: form)
        if (entry.type == "pmr"){
            guard let cell = tableView.cellForRow(at: indexPath) as? FormTableViewCell
                else { return }
            if (cell.isExpanded){
                self.expandedRows.remove(buttonRow)
            }else{return}
            cell.isExpanded = !cell.isExpanded
            cell.presentButton.isUserInteractionEnabled = true
            cell.missingButton.isUserInteractionEnabled = false
            cell.needsRepairButton.isUserInteractionEnabled = true
            self.tableView.beginUpdates()
            self.tableView.endUpdates()
            
            
        }
    }
    @objc func presentbuttonClicked(sender:UIButton) {
        let indexPath = IndexPath(row: sender.tag , section: 0)
        let buttonRow = sender.tag
        
        userEnteredResults[sender.tag].value = "Present"
        
        let entry = findItem(index: buttonRow, form: form)
        if (entry.type == "pmr"){
            guard let cell = tableView.cellForRow(at: indexPath) as? FormTableViewCell
                else { return }
            if (cell.isExpanded){
                self.expandedRows.remove(buttonRow)
            }else{return}
            cell.isExpanded = !cell.isExpanded
            cell.presentButton.isUserInteractionEnabled = false
            cell.missingButton.isUserInteractionEnabled = true
            cell.needsRepairButton.isUserInteractionEnabled = true
            self.tableView.beginUpdates()
            self.tableView.endUpdates()
            
            
        }
    }
    @objc func numFieldDidChange(sender:UITextField){
        userEnteredResults[sender.tag].value = sender.text!
    }
    @objc func textFieldDidChange(sender:UITextField){
        userEnteredResults[sender.tag].note = sender.text!
    }
    @objc func sliderChanged(sender: UISlider) {
        userEnteredResults[sender.tag].value = String(round(sender.value*10)/10)


    }
    @objc func switchChanged(sender: UISwitch) {
        if(sender.isOn){
            userEnteredResults[sender.tag].value = "Pass"
        }else{
            userEnteredResults[sender.tag].value = "Fail"
        }

        
    }
    @IBAction func submitPressed(_ sender: Any) {
        submitAlert(message: "Are you sure you want to submit?") { (result) in
            if(result == true){
                self.tableView.isUserInteractionEnabled = false
                let check = self.checkForm()
                if(check == 0){
                    self.alert(message: "Please completed the entire form!")
                    self.tableView.isUserInteractionEnabled = true
                }else if(check == -1){
                    self.alert(message: "Plese enter a comment for the item that needs repairs")
                    self.tableView.isUserInteractionEnabled = true
                }else if(check == 0){
                    self.alert(message: "This form has been completed already")
                    self.tableView.isUserInteractionEnabled = true
                    //Perform Segue here
                }else{
                    var json:[String:Any]
                    let item = self.userEnteredResults[1]
                    if (item.type == "title"){
                        json = self.toJsonMulti()
                    }else{
                        json = self.toJsonSingle()
                    }
                    self.sentForm(json: json, completion: { (result) in
                        if(result == true){
                            self.sendBackAlert(message: "Form submitted successfully"){ () in
                            self.performSegue(withIdentifier: "toHome", sender: nil)
                            }
                        }else{
                            self.sendBackAlert(message: "Error submitting form"){ () in
                            }
                        }
                    })
                }
            }
        }
    }
}


//    MARK: TABLE FUNCTIONS
extension EqFormViewController{
    
    
    func tableView(_ tableView:UITableView, numberOfRowsInSection section:Int) -> Int
    {
        return formCount()+1
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        
        var cell = tableView.dequeueReusableCell(withIdentifier: "pmr", for: indexPath) as! FormTableViewCell
        
        if (indexPath.row == formCount()){
            cell = tableView.dequeueReusableCell(withIdentifier: "submit", for: indexPath) as! FormTableViewCell
            cell.submitButton.clipsToBounds = true
            cell.submitButton.layer.cornerRadius = 20
            return cell

        }else{
            var item = userEnteredResults[indexPath.row]
            
            
            if (item.type == "pmr") {
                cell = tableView.dequeueReusableCell(withIdentifier: "pmr", for: indexPath) as! FormTableViewCell
                cell.label.text = item.caption
                cell.isExpanded = self.expandedRows.contains(indexPath.row)
                
                cell.missingButton.addTarget(self, action: #selector(EqFormViewController.missingbuttonClicked(sender:)), for: .touchUpInside)
                cell.presentButton.addTarget(self, action: #selector(EqFormViewController.presentbuttonClicked(sender:)), for: .touchUpInside)
                cell.needsRepairButton.addTarget(self, action: #selector(EqFormViewController.needsRepairbuttonClicked(sender:)), for: .touchUpInside)
                cell.commentsTextField.addTarget(self, action: #selector(EqFormViewController.textFieldDidChange(sender:)), for: .editingChanged)
                
                cell.commentsTextField.tag = indexPath.row
                cell.needsRepairButton.tag = indexPath.row
                cell.missingButton.tag = indexPath.row
                cell.presentButton.tag = indexPath.row
                
                if(item.value != ""){
                    switch (item.value){
                        case "Present":
                            cell.presentButton.isSelected = true
                        case "Missing":
                            cell.missingButton.isSelected = true
                        case "Repairs Needed":
                            cell.needsRepairButton.isSelected = true
                        default:
                            item.value = ""
                        
                    }
                    if (item.note != ""){
                        cell.commentsTextField.text = item.note
                    }
                    

                }
                if(item.prev != "None"){
                    cell.pmrPrevResultLabel.text = "Previous result: \t" + item.prev
                    cell.setHeightPmrResult(choice: 1)
                    if(item.prev == "Missing" || item.prev == "Repairs Needed"){
                        cell.pmrPrevResultLabel.textColor = hexStringToUIColor(hex: "a00606")
                        if (item.prev == "Repairs Needed"){
                            cell.pmrPrevCommentLabel.text = "Previous comments: " + item.comment
                            cell.setHeightPmrComment(choice: 1)
                            cell.pmrPrevCommentLabel.textColor = hexStringToUIColor(hex: "a00606")
                        }else{cell.setHeightPmrComment(choice: 0)}
                    }else{
                        cell.pmrPrevResultLabel.textColor = hexStringToUIColor(hex: "12b481")
                        cell.setHeightPmrComment(choice: 0)
                    }
                    
                }else{cell.setHeightPmrResult(choice: 0)}
                
                
                
            }else if(item.type == "num"){
                cell = tableView.dequeueReusableCell(withIdentifier: "num", for: indexPath) as! FormTableViewCell
                cell.numValue.addTarget(self, action: #selector(EqFormViewController.numFieldDidChange(sender:)), for: .editingChanged)
                cell.numValue.tag = indexPath.row
                cell.numName.text = item.caption
                if(item.value != ""){
                    cell.numValue.text = item.value
                }
                if(item.prev != "None"){
                    cell.perNumResultLabel.text = "Previous result: \t" + item.prev
                    cell.setHeightNum(choice: 1)
                    cell.perNumResultLabel.textColor = hexStringToUIColor(hex: "12b481")

                }else{cell.setHeightPer(choice: 0)}
            }else if(item.type == "per"){
                cell = tableView.dequeueReusableCell(withIdentifier: "per", for: indexPath) as! FormTableViewCell
                cell.percentSlider.addTarget(self, action: #selector(EqFormViewController.sliderChanged(sender:)), for: .valueChanged)
                cell.percentSlider.tag = indexPath.row
                cell.percentName.text = item.caption
                cell.percentValue.text = ""
                if(item.value != ""){
                    cell.percentValue.text = item.value
                    cell.percentSlider.value = Float(item.value)!
                }
                if(item.prev != "None"){
                    cell.perPrevResultLabel.text = "Previous result: \t" + item.prev
                    cell.setHeightPer(choice: 1)
                    if (item.prev != "0%"){
                        cell.perPrevResultLabel.textColor = hexStringToUIColor(hex: "12b481")
                    }else{
                        cell.perPrevResultLabel.textColor = hexStringToUIColor(hex: "a00606")
                    }
                }else{cell.setHeightPer(choice: 0)}
                
            }else if(item.type == "pf"){
                cell = tableView.dequeueReusableCell(withIdentifier: "pf", for: indexPath) as! FormTableViewCell
                cell.pfSwitch.addTarget(self, action: #selector(EqFormViewController.switchChanged(sender:)), for: .valueChanged)
                cell.pfSwitch.tag = indexPath.row
                cell.pfName.text = item.caption
                cell.pfValue.text = "Fail"
                cell.pfValue.textColor = hexStringToUIColor(hex: "a00606")
                cell.pfSwitch.isOn = false
                if(item.value != ""){
                    if(item.value == "Pass"){
                        cell.pfValue.text = "Pass"
                        cell.pfValue.textColor = hexStringToUIColor(hex: "12b481")
                        cell.pfSwitch.isOn = true
                    }else{
                        cell.pfSwitch.isOn = false
                    }
                }
                if(item.prev != "None"){
                    cell.pfPrevResultLabel.text = "Previous result: \t" + item.prev
                    if item.prev == "Pass"{
                        cell.pfPrevResultLabel.textColor = hexStringToUIColor(hex: "12b481")
                    }else{
                        cell.pfPrevResultLabel.textColor = hexStringToUIColor(hex: "a00606")
                    }
                    cell.setHeightPF(choice: 1)
                }else{cell.setHeightPF(choice: 0)}
            }else if(item.type == "title"){
                cell = tableView.dequeueReusableCell(withIdentifier: "title", for: indexPath) as! FormTableViewCell
                cell.title.text = item.caption
            }else if(item.type == "formTitle"){
                cell = tableView.dequeueReusableCell(withIdentifier: "formTitle", for: indexPath) as! FormTableViewCell
                let titleParts:[String] = splitFormTitle(formTitle: item.caption)
                cell.truckName.text = titleParts[0]
                cell.formTitle.text = titleParts[1]
                cell.personCompleting.text = "Being completed by: " + userName[0] + " " + userName[1]
                if(item.prev != "None"){
                    cell.prevCompletedByLabel.text = "Previously completed by: " + item.prev
                    cell.prevCompletedByLabel.textColor = hexStringToUIColor(hex: "12b481")
                    cell.prevCompletedOnLabel.text = "Previously completed on: " + item.comment
                    cell.prevCompletedOnLabel.textColor = hexStringToUIColor(hex: "12b481")
                    cell.setHeight(choice: 1)
                }else{cell.setHeight(choice: 0)}
                
                
                
            }
            return cell
        }
    }
}
