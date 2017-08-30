//
//  offTruckViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 8/30/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit

class offTruckViewController: UIViewController {

    @IBOutlet weak var stretchers: UIButton!
    @IBOutlet weak var ladders: UIButton!
    @IBOutlet weak var scba: UIButton!
    @IBOutlet weak var misc: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        stretchers.layer.cornerRadius = 40
        stretchers.clipsToBounds = true
        ladders.layer.cornerRadius = 40
        ladders.clipsToBounds = true
        scba.layer.cornerRadius = 40
        scba.clipsToBounds = true
        misc.layer.cornerRadius = 40
        misc.clipsToBounds = true

        // Do any additional setup after loading the view.
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
