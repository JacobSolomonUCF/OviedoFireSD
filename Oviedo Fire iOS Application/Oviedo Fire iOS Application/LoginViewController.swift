//
//  LoginViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 8/29/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit
import Firebase


class LoginViewController: UIViewController,UITextFieldDelegate  {

    //Buttons
    @IBOutlet weak var activityView: UIActivityIndicatorView!
    @IBOutlet weak var loginButton: UIButton!
    @IBOutlet weak var passwordField: UITextField!
    @IBOutlet weak var emailField: UITextField!
    @IBOutlet weak var signUpButton: UIButton!
    
    override func viewDidLoad() {
        activityView.isHidden = true
        super.viewDidLoad()
        
        //Hides the navigation bar
        self.navigationController?.isNavigationBarHidden = true
        
        // Do any additional setup after loading the view.
        checkForUser()
        screenFormat()
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func screenFormat(){
        loginButton.layer.cornerRadius = 20
        loginButton.clipsToBounds = true
        
        emailField.layer.cornerRadius = 20
        emailField.clipsToBounds = true
        emailField.delegate = self
        emailField.tag = 0
        
        passwordField.layer.cornerRadius = 20
        passwordField.clipsToBounds = true
        passwordField.delegate = self
        passwordField.tag = 1
    }
    
    func checkForUser(){
        Auth.auth().addStateDidChangeListener { auth, user in
            if user != nil{
                self.performSegue(withIdentifier: "toHome", sender: nil)
            }else{
    
            }
        }
    }

    // MARK ACTIONS
    @IBAction func Login(_ sender: Any) {
        if emailField.text != "" && passwordField.text != ""{
            activityView.isHidden = false
            activityView.startAnimating()
            Auth.auth().signIn(withEmail: emailField.text!, password: passwordField.text!) { (user, error) in
                if user != nil{
                   
                    self.emailField.text = nil
                    self.passwordField.text = nil
                    self.emailField.resignFirstResponder()
                    self.passwordField.resignFirstResponder()
                    
                    self.activityView.isHidden = true
                    self.activityView.stopAnimating()
                    self.performSegue(withIdentifier: "toHome", sender: nil)
                    }else{
                    if let myError = error?.localizedDescription{
                        print(myError)
                    self.alert(message: "Username/Password invalid")
                    }
                }
            }
        
        }else{
            alert(message: "Please enter username/password")
        }
    }
}
