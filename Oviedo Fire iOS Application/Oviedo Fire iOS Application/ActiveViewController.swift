//
//  ActiveViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 9/13/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit
import Alamofire

class ActiveViewController: UIViewController, UITableViewDelegate {

    @IBOutlet weak var table: UITableView!
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        Alamofire.request("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/activeVehicles?uid=Q5SBBvpqxNR1kRwZywcnNJddfXr1") .responseJSON { response in
            if let result = response.result.value as? [String:Any],
                let main = result["list"] as? [[String:String]]{
                // main[0]["name"] or use main.first?["name"] for first index or loop through array
                for obj in main{
                    print(obj["name"]!)
                    print(obj["id"]!)
                }
                
                print(main[0]["name"]!)
            }
            
            
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
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
