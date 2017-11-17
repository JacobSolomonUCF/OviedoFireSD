//
//  QRScannerViewController.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 9/4/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//
import AVFoundation
import UIKit
import Firebase

class QRScannerController: UIViewController, AVCaptureMetadataOutputObjectsDelegate {
    
    @IBOutlet var messageLabel:UILabel!
    @IBOutlet var topbar: UIView!

    var message:String = "Default"
    var captureDevice:AVCaptureDevice?
    var videoPreviewLayer:AVCaptureVideoPreviewLayer?
    var captureSession:AVCaptureSession?
    var userName:[String] = []
    var form:completeForm = completeForm.init(title: "Default", alert: "Default", subSection: [])
    var resultForm = result(completeBy: "Default", timeStamp: "Default", title: "Default", resultSection: [])
    let userID = Auth.auth().currentUser!.uid
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.navigationBar.prefersLargeTitles = true
        captureSession?.startRunning()
        codeFrame.frame = CGRect.zero
        codeLabel.text = "Please scan a QR Code"
    }
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        AppUtility.lockOrientation(.portrait)
        // Or to rotate and lock
        // AppUtility.lockOrientation(.portrait, andRotateTo: .portrait)
        
    }
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        
        // Don't forget to reset when view is being removed
        AppUtility.lockOrientation(.all)
    }
 
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        navigationItem.title = "Scanner"
        view.backgroundColor = .white
        
        captureDevice = AVCaptureDevice.default(for: .video)
        // Check if captureDevice returns a value and unwrap it
        if let captureDevice = captureDevice {
            
            do {
                let input = try AVCaptureDeviceInput(device: captureDevice)
                
                captureSession = AVCaptureSession()
                guard let captureSession = captureSession else { return }
                captureSession.addInput(input)
                
                let captureMetadataOutput = AVCaptureMetadataOutput()
                captureSession.addOutput(captureMetadataOutput)
                
                captureMetadataOutput.setMetadataObjectsDelegate(self, queue: .main)
                captureMetadataOutput.metadataObjectTypes = [.code128, .qr, .ean13,  .ean8, .code39] //AVMetadataObject.ObjectType
                
                captureSession.startRunning()
                
                videoPreviewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
                videoPreviewLayer?.videoGravity = .resizeAspectFill
                videoPreviewLayer?.frame = view.layer.bounds
                view.layer.addSublayer(videoPreviewLayer!)
                
            } catch {
                print("Error Device Input")
            }
            
        }
        
        view.addSubview(codeLabel)
        codeLabel.bottomAnchor.constraint(equalTo: view.bottomAnchor).isActive = true
        codeLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
        codeLabel.heightAnchor.constraint(equalToConstant: 50).isActive = true
        codeLabel.widthAnchor.constraint(equalTo: view.widthAnchor).isActive = true
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    let codeLabel:UILabel = {
        let codeLabel = UILabel()
        codeLabel.backgroundColor = .white
        codeLabel.translatesAutoresizingMaskIntoConstraints = false
        return codeLabel
    }()
    
    let codeFrame:UIView = {
        let codeFrame = UIView()
        codeFrame.layer.borderColor = UIColor.green.cgColor
        codeFrame.layer.borderWidth = 2
        codeFrame.frame = CGRect.zero
        codeFrame.translatesAutoresizingMaskIntoConstraints = false
        return codeFrame
    }()
    
    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        if metadataObjects.count == 0 {
            //print("No Input Detected")
            codeFrame.frame = CGRect.zero
            codeLabel.text = "No Data"
            return
        }
        
        let metadataObject = metadataObjects[0] as! AVMetadataMachineReadableCodeObject
        
        guard let stringCodeValue = metadataObject.stringValue else { return }
        
        view.addSubview(codeFrame)
        
        guard let barcodeObject = videoPreviewLayer?.transformedMetadataObject(for: metadataObject) else { return }
        codeFrame.frame = barcodeObject.bounds
        
        // Play system sound with custom mp3 file

        
        // Stop capturing and hence stop executing metadataOutput function over and over again
        message = stringCodeValue
        captureSession?.stopRunning()
        
        getForm(userID: userID, formId: message) { (item) in
            self.form = item
            if (item.alert == "No Form Found" && item.title == "No Form Found"){
                self.codeLabel.text = "No Form Found"
                let alert = UIAlertController(title: "", message: "Invalid Form", preferredStyle: UIAlertControllerStyle.alert)
                self.present(alert, animated: true, completion: nil)
                alert.addAction(UIAlertAction(title: "Okay", style: .default, handler: { (action: UIAlertAction!) in
                    self.captureSession?.startRunning()
                    self.codeFrame.frame = CGRect.zero
                }))
            }else{
                let title = self.splitFormTitle(formTitle: self.form.subSection[0].formItem[0].caption)
                self.codeLabel.text = title[1]
                self.checkCompletion(userID: self.userID, formId: self.message, completion: { (isCompleted) in
                    if(isCompleted == "true"){
                        
                        self.getResults(userID: self.userID, formId: self.message, completion: { (result) in
                            self.resultForm = result
                            
                            let refreshAlert = UIAlertController(title: "Attention", message: "This form has already been completed", preferredStyle: UIAlertControllerStyle.alert)
                            self.present(refreshAlert, animated: true, completion: nil)
                            refreshAlert.addAction(UIAlertAction(title: "Okay", style: .default, handler: { (action: UIAlertAction!) in
                                self.performSegue(withIdentifier: "toResult" , sender: nil)
                                
                            }))
                        })
                        
                    }else{
                        self.performSegue(withIdentifier: "toForm", sender: nil)
                    }
                })
            }
        }
        
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toForm"{
            let nextController = segue.destination as! EqFormViewController
            nextController.userEnteredResults = createResults(form: form)
            nextController.form = form
            nextController.formName = form.title
            nextController.userName = userName
            nextController.formId = message
            nextController.commingFrom.type = "qr"
            nextController.commingFrom.section = ""
        }else if segue.identifier == "toResult"{
            let nextController = segue.destination as! resultsViewController
            nextController.resultForm = resultForm
            nextController.userName = userName
        }
    }
    
}
