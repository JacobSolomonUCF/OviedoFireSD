//
//  EqFormViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 9/15/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit


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

    var checkedRows=Set<NSIndexPath>()
    
    var formName = ""
    var formId:String = ""
    var form = completeForm(title: "Default", alert: "Default" , subSection: [] )
    var selectedIndex:Int = 0

    func setupView(){
        navigationController?.navigationBar.prefersLargeTitles = false
        navigationItem.title = ""
        tableView.estimatedRowHeight = 100
        tableView.rowHeight = UITableViewAutomaticDimension
        

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
    
    
    func tableView(_ tableView:UITableView, numberOfRowsInSection section:Int) -> Int
    {
        return formCount()
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        
        var cell = tableView.dequeueReusableCell(withIdentifier: "pmr", for: indexPath) as! FormTableViewCell
        let entry = findItem(index: indexPath.row, form: form)
        
        if (entry.type == "pmr") {
            cell = tableView.dequeueReusableCell(withIdentifier: "pmr", for: indexPath) as! FormTableViewCell
            cell.label.text = entry.caption
            cell.commentsTextField.isHidden = true
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
        }

 
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {

    
    
    }
    
    @IBAction func needsRepairClicked(_ sender: Any) {
        updateViewConstraints()
    }
    


    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

    
}
