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

    @IBOutlet weak var loginButton: UIButton!
    @IBOutlet weak var passwordField: UITextField!
    @IBOutlet weak var emailField: UITextField!
    @IBOutlet weak var signUpButton: UIButton!

    

    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationController?.isNavigationBarHidden = true
        // Do any additional setup after loading the view.
        checkForUser()
    
        screenFormat()
        
        

        

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
                print("IT WORKS")
                self.performSegue(withIdentifier: "toHome", sender: nil)
            }else{
                
            }
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool
    {
        // Try to find next responder
        if let nextField = textField.superview?.viewWithTag(textField.tag + 1) as? UITextField {
            nextField.becomeFirstResponder()
        } else {
            // Not found, so remove keyboard.
            textField.resignFirstResponder()
            Login(self)
            
        }
        // Do not add a line break
        return false
    }

    

    // MARK ACTIONS
    @IBAction func Login(_ sender: Any) {
        
        if emailField.text != "" && passwordField.text != ""{
            
            Auth.auth().signIn(withEmail: emailField.text!, password: passwordField.text!) { (user, error) in
                if user != nil{
                   
                    self.emailField.text = nil
                    self.passwordField.text = nil
                    self.emailField.resignFirstResponder()
                    self.passwordField.resignFirstResponder()
                    
                    
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
