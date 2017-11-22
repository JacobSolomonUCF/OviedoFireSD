//
//  resultsViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 10/18/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit

class resultsViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, formCompleted {
    
    
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    @IBOutlet weak var tableView: UITableView!
    
    var commingFrom:fromWhere = fromWhere.init(type: "Default", section: "Default")
    var resultForm = result(completeBy: "Default", timeStamp: "Default", title: "Default", resultSection: [])
    var form = completeForm(title: "Default", alert: "Default" , subSection: [] )
    var userName:[String] = []
    var formId:String = ""
    
    func sendSelectionListBack(data: [Any]) {
        resultForm = data[0] as! result
        tableView.reloadData()
        tableView.isUserInteractionEnabled = true
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupView()

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
            
            nextController.userEnteredResults = createEditFormResults(form: form)
            nextController.form = form
            nextController.userName = userName
            nextController.formId = formId
            nextController.commingFrom.type = "results"
            nextController.commingFrom.section = formId
            nextController.isEdited = true
            nextController.delegate = self
            
            
        }
        self.stopSpinning(activityView: self.activityView)
        tableView.isUserInteractionEnabled = true
    }
    
    
    
    func setupView(){
        stopSpinning(activityView: activityView)
        navigationController?.navigationBar.prefersLargeTitles = false
        // Create  button for navigation item with refresh
        let refreshButton =  UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.edit, target: self, action: #selector(resultsViewController.editForm))
        
        // I set refreshButton for the navigation item
        navigationItem.rightBarButtonItem = refreshButton
    }
    @objc func editForm() {
        self.okayCancelAlert(message: "This form is complete, Are you sure you want to change the results?") { (value) in
            if (value == true){
                self.startSpinning(activityView: self.activityView)
                self.tableView.allowsSelection = false
                self.tableView.isUserInteractionEnabled = false
                self.form = self.resultToFrom()
                self.performSegue(withIdentifier: "toForm", sender: nil)
            }else{
                
            }
        }

    }
    
    
    func resultToFrom()-> completeForm{
        var form = completeForm(title: "Default", alert: "Default" , subSection: [])
        var subSectionList:[subSection] = []
        var formItemList:[formItem] = []
        var sectionLabel: String = "None"
        
        form.title = resultForm.title
        for section in resultForm.resultSection{
            for item in section.result{
                if(item.type == "title"){
                    formItemList.append(formItem.init(caption: resultForm.title, type: "formTitle", prev: resultForm.completedBy, comment: resultForm.timeStamp))
                }else if(item.type == "sectionTitle"){
                    formItemList.append(formItem.init(caption: item.caption, type: "title", prev: "None", comment: "None"))
                    sectionLabel = item.caption
                }else if(item.comment != "No Comment"){
                    formItemList.append(formItem.init(caption: item.caption, type: item.type, prev: item.value, comment: item.comment))
                }else{
                    formItemList.append(formItem.init(caption: item.caption, type: item.type, prev: item.value, comment: "None"))
                }
            }
            subSectionList.append(subSection.init(title: sectionLabel, formItem: formItemList))
            formItemList.removeAll()
        }
        form.subSection = subSectionList
        
        return form
        
    }
    
    
    func formCount() -> Int{
        var count = 0
        let subsections = resultForm.resultSection
        for items in subsections{
            let sections = items.result
            for _ in sections{
                count += 1
            }
            
        }
        return count
    }
    
    func findItem(index:Int, form:result) -> resultItem{
        var item = resultItem.init(caption: "N/A", value: "N/A", type: "N/A", comment: "No Comment")
        
        var count = 0
        let subsections = resultForm.resultSection
        for items in subsections{
            let sections = items.result
            for row in sections{
                if(index == count){
                    item.caption = row.caption
                    item.value = row.value
                    item.type = row.type
                    item.comment = row.comment
                    return item
                }
                count += 1
            }
        }
        return item
    }
    

}

extension resultsViewController{
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return formCount()
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let item = findItem(index: indexPath.row, form: resultForm)
        var cell = tableView.dequeueReusableCell(withIdentifier: "results", for: indexPath) as! resultsTableViewCell
        
        if(item.type == "title"){
                cell = tableView.dequeueReusableCell(withIdentifier: "formTitle", for: indexPath) as! resultsTableViewCell
                let titleParts:[String] = splitFormTitle(formTitle: item.comment)
                cell.truckName.text = titleParts[0]
                cell.formTitle.text = titleParts[1]
                cell.personCompleted.text = "Completed by: " + item.caption + " on " + item.value
                
            
        }else if(item.type == "sectionTitle"){
                cell = tableView.dequeueReusableCell(withIdentifier: "title", for: indexPath) as! resultsTableViewCell
                cell.sectionTitle.text = item.caption
        }else{
            cell.caption.text = item.caption
            cell.values.text = item.value
            
//            Setting red text color
            if(item.type == "pmr" && (item.value == "Repairs Needed" || item.value == "Missing")){
                cell.values.textColor = hexStringToUIColor(hex: "a00606")
            }else if(item.type == "pf" && item.value == "Failed"){
                cell.values.textColor = hexStringToUIColor(hex: "a00606")
            }else if(item.type == "per" && item.value == "0.0"){
                cell.values.textColor = hexStringToUIColor(hex: "a00606")
                cell.values.text = item.value + "%"
            }else{
                 cell.values.textColor = hexStringToUIColor(hex: "12b481")
            }
            
            
            if (item.comment != "No Comment"){
                cell.comments.text = "Comment: " + item.comment
                cell.setHeight(choice: 1)
            }else{cell.setHeight(choice: 0)}
            
        }
        return cell
    }
    
}
