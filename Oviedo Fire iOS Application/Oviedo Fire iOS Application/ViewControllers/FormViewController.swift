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
    
    func setupView(){
        
        if form.alert != "No Alert" {
            alert(message: form.alert)
        }
        
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
    
    
    
    //    MARK: Button Actions
    
    @objc func needsRepairbuttonClicked(sender:UIButton) {
        let indexPath = IndexPath(row: sender.tag , section: 0)
        let buttonRow = sender.tag
        print("Needs Repair \(buttonRow)")
        
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
        print("Missing Repair \(buttonRow)")
        
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
        print("Present Repair \(buttonRow)")
        
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
            let entry = findItem(index: indexPath.row, form: form)
            
            if (entry.type == "pmr") {
                cell = tableView.dequeueReusableCell(withIdentifier: "pmr", for: indexPath) as! FormTableViewCell
                cell.label.text = entry.caption
                cell.isExpanded = self.expandedRows.contains(indexPath.row)
                cell.missingButton.addTarget(self, action: #selector(EqFormViewController.missingbuttonClicked(sender:)), for: .touchUpInside)
                cell.presentButton.addTarget(self, action: #selector(EqFormViewController.presentbuttonClicked(sender:)), for: .touchUpInside)
                cell.needsRepairButton.addTarget(self, action: #selector(EqFormViewController.needsRepairbuttonClicked(sender:)), for: .touchUpInside)
                cell.needsRepairButton.tag = indexPath.row
                cell.missingButton.tag = indexPath.row
                cell.presentButton.tag = indexPath.row
            }else if(entry.type == "num"){
                cell = tableView.dequeueReusableCell(withIdentifier: "num", for: indexPath) as! FormTableViewCell
                cell.numName.text = entry.caption
            }else if(entry.type == "per"){
                cell = tableView.dequeueReusableCell(withIdentifier: "per", for: indexPath) as! FormTableViewCell
                cell.percentName.text = entry.caption
                cell.percentValue.text = ""
            }else if(entry.type == "pf"){
                cell = tableView.dequeueReusableCell(withIdentifier: "pf", for: indexPath) as! FormTableViewCell
                cell.pfName.text = entry.caption
                cell.pfValue.text = "Fail"
                cell.pfValue.textColor = UIColor.red
            }else if(entry.type == "title"){
                cell = tableView.dequeueReusableCell(withIdentifier: "title", for: indexPath) as! FormTableViewCell
                cell.title.text = entry.caption
            }else if(entry.type == "formTitle"){
                cell = tableView.dequeueReusableCell(withIdentifier: "formTitle", for: indexPath) as! FormTableViewCell
                let titleParts:[String] = splitFormTitle(formTitle: entry.caption)
                cell.truckName.text = titleParts[0]
                cell.formTitle.text = titleParts[1]
                cell.personCompleting.text = "Being completed by: " + userName[0] + " " + userName[1]
                
            }
            
            
            return cell
        }
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        print(indexPath.row)
        
        
    }
}

