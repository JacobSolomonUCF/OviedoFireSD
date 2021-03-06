//
//  AppDelegate.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 8/29/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit
import Firebase
import IQKeyboardManagerSwift


@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var timer = Timer()
    var flag = 0

    /// set orientations you want to be allowed in this property by default
    var orientationLock = UIInterfaceOrientationMask.all
    
    func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
        return self.orientationLock
    }
    @objc func terminateApp(){
        // Do your segue and invalidate the timer
        timer.invalidate()
        Logout(self)
    }
    func Logout(_ sender: Any) {
        do {
            flag = 1
            print("Signed Out")
            try Auth.auth().signOut()
        }catch let error as NSError{
            print("Error signing out: \(error)")
        }
    }

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        IQKeyboardManager.sharedManager().enable = true
        FirebaseApp.configure()
        return true
    }
    
    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
        print("Resign")
        
        if var topController = UIApplication.shared.keyWindow?.rootViewController {
            while let presentedViewController = topController.presentedViewController {
                topController = presentedViewController
            }
            
            // topController should now be your topmost view controller
            if topController is LoginViewController{
                print("No logout already on loginview")
            }else{
                timer = Timer.scheduledTimer(timeInterval: 10800, target: self, selector: #selector(AppDelegate.terminateApp), userInfo: nil, repeats: true)
                flag = 0
            }
        }
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        print("Enter Foreground")
        timer.invalidate()
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        print("Become Active")
        if(Auth.auth().currentUser == nil && flag == 1){
            let alert = UIAlertController(title: "Attention", message:"You have been timed out for inactivity, Please login again.", preferredStyle: UIAlertControllerStyle.alert)
            
            // add an action (button)
            alert.addAction(UIAlertAction(title: "Okay", style: .default, handler: { (action: UIAlertAction!) in
                 let mainStoryboardIpad : UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
                 let initialViewControlleripad : UIViewController = mainStoryboardIpad.instantiateViewController(withIdentifier: "Login") as! LoginViewController
                 self.window = UIWindow(frame: UIScreen.main.bounds)
                 self.window?.rootViewController = initialViewControlleripad
                 self.window?.makeKeyAndVisible()
                 self.flag = 0
            }))
            
            // show alert
            let alertWindow = UIWindow(frame: UIScreen.main.bounds)
            alertWindow.rootViewController = UIViewController()
            alertWindow.windowLevel = UIWindowLevelAlert + 1;
            alertWindow.makeKeyAndVisible()
            alertWindow.rootViewController?.present(alert, animated: true, completion: nil)
            
           /* let mainStoryboardIpad : UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
            let initialViewControlleripad : UIViewController = mainStoryboardIpad.instantiateViewController(withIdentifier: "Login") as! LoginViewController
            self.window = UIWindow(frame: UIScreen.main.bounds)
            self.window?.rootViewController = initialViewControlleripad
            self.window?.makeKeyAndVisible()*/
                
         
            
        }
        
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        print("Exit")
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }


}

