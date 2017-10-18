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

        print(formCount())
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
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
        let cell = tableView.dequeueReusableCell(withIdentifier: "results", for: indexPath) as! resultsTableViewCell
        cell.caption.text = item.caption
        cell.values.text = item.value
        if (item.comment != "No Comment"){
            cell.comments.text = item.comment
            cell.setHeight(choice: 1)
        }else{cell.setHeight(choice: 0)}
        
        return cell
    }
    
}
