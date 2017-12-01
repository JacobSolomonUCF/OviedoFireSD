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
    
    //    Variables
    var firstName:[String] = []
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //Hides the navigation bar
        self.navigationController?.isNavigationBarHidden = true
        
        // Do any additional setup after loading the view.
        
        checkForUser()
        UILayout()
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        stopSpinning(activityView: activityView)
        if segue.identifier == "toHome"{
            let navVC = segue.destination as? UINavigationController
            let nextController = navVC?.viewControllers.first as! HomeViewController
            nextController.firstName = firstName
        }
        
    
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
    
    func UILayout(){
        
        loginButton.layer.cornerRadius = loginButton.layer.frame.height/4
        loginButton.clipsToBounds = true
        
        emailField.layer.cornerRadius = emailField.layer.frame.height/4
        emailField.clipsToBounds = true
        emailField.delegate = self
        emailField.tag = 0
        
        passwordField.layer.cornerRadius = passwordField.layer.frame.height/4
        passwordField.clipsToBounds = true
        passwordField.delegate = self
        passwordField.tag = 1
    }
    
    func checkForUser(){
        startSpinning(activityView: activityView)
        Auth.auth().addStateDidChangeListener { auth, user in
            if user != nil{
                let userId = Auth.auth().currentUser!.uid
                self.getUsername(userID: userId, completion: { (name) -> Void in
                    self.firstName = name
                    self.performSegue(withIdentifier: "toHome", sender: nil)
                })
            }else{
                self.stopSpinning(activityView: self.activityView)
            }
        }
    }

    // MARK ACTIONS
    @IBAction func Login(_ sender: Any) {
        if emailField.text != "" && passwordField.text != ""{
            self.startSpinning(activityView: self.activityView)
            Auth.auth().signIn(withEmail: emailField.text!, password: passwordField.text!) { (user, error) in
                if user != nil{
                    let userId = Auth.auth().currentUser!.uid
                    self.getUsername(userID: userId, completion: { (name) -> Void in
                        self.firstName = name
                
                        self.passwordField.text = nil
                        self.emailField.resignFirstResponder()
                        self.passwordField.resignFirstResponder()
                        
                        self.stopSpinning(activityView: self.activityView)
                        
                        self.performSegue(withIdentifier: "toHome", sender: nil)
                    })
                    
                    }else{
                    
                    if let myError = error?.localizedDescription{
                        print(myError)
                        if(myError.contains("Network error")){
                            self.alert(message: "Network Error")
                        }else{
                            self.alert(message: "Username/Password invalid")
                        }
                        self.stopSpinning(activityView: self.activityView)
                    }
                }
            }
        
        }else{
            alert(message: "Please enter username/password")
            self.stopSpinning(activityView: self.activityView)
        }
    }

}
