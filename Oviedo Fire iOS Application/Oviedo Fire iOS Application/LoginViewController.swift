//
//  LoginViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 8/29/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit

class LoginViewController: UIViewController {
    
    @IBOutlet weak var login: UIButton!
    @IBOutlet weak var password: UITextField!
    @IBOutlet weak var email: UITextField!
    

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        login.layer.cornerRadius = 20
        login.clipsToBounds = true
        
        email.layer.cornerRadius = 15
        email.clipsToBounds = true
        
        password.layer.cornerRadius = 15
        password.clipsToBounds = true
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
