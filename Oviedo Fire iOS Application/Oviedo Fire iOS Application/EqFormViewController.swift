//
//  EqFormViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 9/15/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit

class EqFormViewController: UIViewController, UITableViewDelegate, UITableViewDataSource  {
    
    @IBOutlet weak var tableView: UITableView!
    
    
    var formId:String = ""
    var form:[formItem] = []


    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.estimatedRowHeight = 100.00
        tableView.rowHeight = UITableViewAutomaticDimension
        // Do any additional setup after loading the view.
        
    
        
        
        
        
        
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
        let cell = tableView.dequeueReusableCell(withIdentifier: "pmr", for: indexPath) as! pmrFormTableViewCell
        cell.label.text = form[indexPath.row].caption

        return cell
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
