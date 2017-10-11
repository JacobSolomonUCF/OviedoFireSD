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


class EqFormViewController: UIViewController, UITableViewDelegate, UITableViewDataSource  {
    
    @IBOutlet weak var tableView: UITableView!

    var checkedRows=Set<NSIndexPath>()
    
    var formName = ""
    var formId:String = ""
    var form:[formItem] = []

    func setupView(){
        navigationItem.title = formName
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupView()
        
    
        
        
        
        
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    func tableView(_ tableView:UITableView, numberOfRowsInSection section:Int) -> Int
    {
        return form.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        var cell = tableView.dequeueReusableCell(withIdentifier: "pmr", for: indexPath) as! pmrFormTableViewCell
        if (form[indexPath.row].type == "pmr") {
            cell = tableView.dequeueReusableCell(withIdentifier: "pmr", for: indexPath) as! pmrFormTableViewCell
            cell.label.text = form[indexPath.row].caption
        }else if(form[indexPath.row].type == "num"){
            cell = tableView.dequeueReusableCell(withIdentifier: "num", for: indexPath) as! pmrFormTableViewCell
            cell.numLabel.text = form[indexPath.row].caption
        }
//        let cell = tableView.dequeueReusableCell(withIdentifier: "pmr", for: indexPath) as! pmrFormTableViewCell
//        cell.label.text = form[indexPath.row].caption

 
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        print(indexPath.row)
    
    
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
