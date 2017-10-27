//
//  resultsViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 10/18/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit

class resultsViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    
    var resultForm = result(completeBy: "Default", timeStamp: "Default", title: "Default", resultSection: [])
    var userName:[String] = []
     

    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupView()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    func setupView(){
        navigationController?.navigationBar.prefersLargeTitles = false
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
            }else if(item.type == "pf" && item.value == "Fail"){
                cell.values.textColor = hexStringToUIColor(hex: "a00606")
            }else if(item.type == "per" && item.value == "0.0"){
                cell.values.textColor = hexStringToUIColor(hex: "a00606")
                cell.values.text = item.value + "%"
            }
            
            
            if (item.comment != "No Comment"){
                cell.comments.text = "Comment: " + item.comment
                cell.setHeight(choice: 1)
            }else{cell.setHeight(choice: 0)}
            
        }
        return cell
    }
    
}
