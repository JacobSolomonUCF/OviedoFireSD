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
    
    var expandedRows = Set<Int>()
    var checkedRows=Set<NSIndexPath>()
    
    let userID = Auth.auth().currentUser!.uid
    var formName = ""
    var formId:String = ""
    var form = completeForm(title: "Default", alert: "Default" , subSection: [] )
    var selectedIndex:Int = 0
    var userName:[String] = []
    var userEnteredResults:[userResults] = []
    
    func setupView(){
        
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
        
        
    }
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupView()
        
        print(userEnteredResults)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
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
        var item = formItem.init(caption: "NA", type: "NA")
        
        var count = 0
        let subsections = form.subSection
        for items in subsections{
            let sections = items.formItem
            for row in sections{
                if(index == count){
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
    
    func toJson(){
        //        let value = JSONValue(...) if value != .JInvalid { ... some logic here }
        for items in userEnteredResults{
            
        }
        
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
        let check = checkForm()
        if(check == 0){
            alert(message: "Please completed the entire form!")
        }else if(check == -1){
            alert(message: "Plese enter a comment for the item that needs repairs")
        }else{
            alert(message: "ALL GOOD")
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
                
                
            }else if(item.type == "num"){
                cell = tableView.dequeueReusableCell(withIdentifier: "num", for: indexPath) as! FormTableViewCell
                cell.numValue.addTarget(self, action: #selector(EqFormViewController.numFieldDidChange(sender:)), for: .editingChanged)
                cell.numValue.tag = indexPath.row
                cell.numName.text = item.caption
                if(item.value != ""){
                    cell.numValue.text = item.value
                }
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
            }else if(item.type == "pf"){
                cell = tableView.dequeueReusableCell(withIdentifier: "pf", for: indexPath) as! FormTableViewCell
                cell.pfSwitch.addTarget(self, action: #selector(EqFormViewController.switchChanged(sender:)), for: .valueChanged)
                cell.pfSwitch.tag = indexPath.row
                cell.pfName.text = item.caption
                cell.pfValue.text = "Fail"
                cell.pfValue.textColor = UIColor.red
                cell.pfSwitch.isOn = false
                if(item.value != ""){
                    if(item.value == "Pass"){
                        cell.pfValue.text = "Pass"
                        cell.pfValue.textColor = UIColor.green
                        cell.pfSwitch.isOn = true
                    }else{
                        cell.pfSwitch.isOn = false
                    }
                }
            }else if(item.type == "title"){
                cell = tableView.dequeueReusableCell(withIdentifier: "title", for: indexPath) as! FormTableViewCell
                cell.title.text = item.caption
            }else if(item.type == "formTitle"){
                cell = tableView.dequeueReusableCell(withIdentifier: "formTitle", for: indexPath) as! FormTableViewCell
                let titleParts:[String] = splitFormTitle(formTitle: item.caption)
                cell.truckName.text = titleParts[0]
                cell.formTitle.text = titleParts[1]
                cell.personCompleting.text = "Being completed by: " + userName[0] + " " + userName[1]
                
            }
            return cell
        }
    }
}
