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
    var firstName = "NO NAME"
    
    override func viewDidLoad() {
        stopSpinning(activityView: activityView)
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
        if segue.identifier == "toHome"{
            let navVC = segue.destination as? UINavigationController
            let nextController = navVC?.viewControllers.first as! HomeViewController
            nextController.firstName = firstName
        }
    
    }
    
    func UILayout   (){
        
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
                let userId = Auth.auth().currentUser!.uid
                self.getUsername(userID: userId, completion: { (name) -> Void in
                    self.firstName = name
                    self.performSegue(withIdentifier: "toHome", sender: nil)
                })
            }else{
    
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
//                        print("FIRST NAME" + self.firstName)
                
                        self.emailField.text = nil
                        self.passwordField.text = nil
                        self.emailField.resignFirstResponder()
                        self.passwordField.resignFirstResponder()
                        
                        self.stopSpinning(activityView: self.activityView)
                        
                        self.performSegue(withIdentifier: "toHome", sender: nil)
                    })
                    
                    }else{
                    
                    if let myError = error?.localizedDescription{
                        print(myError)
                        self.alert(message: "Username/Password invalid")
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