//
//  SignUpViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 9/12/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit
import Firebase

class SignUpViewController: UIViewController {

    //Buttons and text fields
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    @IBOutlet weak var email: UITextField!
    @IBOutlet weak var password: UITextField!
    @IBOutlet weak var repeatPassword: UITextField!
    
    override func viewDidLoad() {
        activityView.isHidden = true
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    
    // MARK: Actions

    @IBAction func loginAction(_ sender: Any) {
        if email.text != "" && password.text != "" && repeatPassword.text != ""{
            if password.text == repeatPassword.text{
               activityView.isHidden = false
                activityView.startAnimating()
                Auth.auth().createUser(withEmail: email.text!, password: password.text!) { (user, error) in
                    if user != nil{
                        self.performSegue(withIdentifier: "toHome", sender: nil)
                    }else{
                        if let myError = error?.localizedDescription{
                            print(myError)
                        }
                    }
                    self.activityView.stopAnimating()
                    self.activityView.isHidden = true
                }
            }else{
                alert(message: "Passwords do not match")
            }
        
        }else{
            alert(message: "Please make sure all fields are entered")
        }
    }
}