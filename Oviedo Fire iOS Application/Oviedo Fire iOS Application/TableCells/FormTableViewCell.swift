//
//  pmrFormTableViewCell.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 10/2/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit
import Firebase
import Alamofire
import DLRadioButton



class FormTableViewCell: UITableViewCell{

    @IBOutlet weak var label: UILabel!
    @IBOutlet weak var presentButton: DLRadioButton!
    @IBOutlet weak var missingButton: DLRadioButton!
    @IBOutlet weak var needsRepairButton: DLRadioButton!
    @IBOutlet weak var commentsTextField: UITextField!
    @IBOutlet weak var numName: UILabel!
    @IBOutlet weak var numValue: UITextField!
    @IBOutlet weak var percentName: UILabel!
    @IBOutlet weak var percentValue: UILabel!
    @IBOutlet weak var percentSlider: UISlider!
    @IBOutlet weak var pfName: UILabel!
    @IBOutlet weak var pfValue: UILabel!
    @IBOutlet weak var pfSwitch: UISwitch!
    @IBOutlet weak var title: UILabel!
    @IBOutlet weak var commentHieght: NSLayoutConstraint!
    @IBOutlet weak var truckName: UILabel!
    @IBOutlet weak var formTitle: UILabel!
    @IBOutlet weak var personCompleting: UILabel!
    @IBOutlet weak var submitButton: UIButton!
    @IBOutlet weak var prevCompletedBy: NSLayoutConstraint!
    @IBOutlet weak var prevCompletedOn: NSLayoutConstraint!
    @IBOutlet weak var prevCompletedOnLabel: UILabel!
    @IBOutlet weak var prevCompletedByLabel: UILabel!
    @IBOutlet weak var pfPrevResultLabel: UILabel!
    @IBOutlet weak var pfPrevResultHeight: NSLayoutConstraint!
    @IBOutlet weak var perPrevResultLabel: UILabel!
    @IBOutlet weak var perPrevResultHeight: NSLayoutConstraint!
    @IBOutlet weak var perNumResultLabel: UILabel!
    @IBOutlet weak var prevNumResultHeight: NSLayoutConstraint!
    @IBOutlet weak var pmrPrevResultLabel: UILabel!
    @IBOutlet weak var pmrPrevResultHeight: NSLayoutConstraint!
    @IBOutlet weak var pmrPrevCommentLabel: UILabel!
    @IBOutlet weak var pmrPrevCommentHeight: NSLayoutConstraint!
    

    func setHeight(choice:Int){
        if(choice == 1){
            self.prevCompletedBy.constant = 20.0
            self.prevCompletedOn.constant = 20.0
        }else{
            self.prevCompletedBy.constant = 0.0
            self.prevCompletedOn.constant = 0.0
        }
        
    }
    func setHeightPF(choice:Int){
        if(choice == 1){
            self.pfPrevResultHeight.constant = 20.0
        }else{
            self.pfPrevResultHeight.constant = 0.0

        }
        
    }
    func setHeightPer(choice:Int){
        if(choice == 1){
            self.perPrevResultHeight.constant = 20.0
        }else{
            self.perPrevResultHeight.constant = 0.0
            
        }
        
    }
    func setHeightNum(choice:Int){
        if(choice == 1){
            self.prevNumResultHeight.constant = 20.0
        }else{
            self.prevNumResultHeight.constant = 0.0
            
        }
        
    }
    func setHeightPmrResult(choice:Int){
        if(choice == 1){
            self.pmrPrevResultHeight.constant = 25.0
        }else{
            self.pmrPrevResultHeight.constant = 0.0
            
        }
        
    }
    func setHeightPmrComment(choice:Int){
        if(choice == 1){
            self.pmrPrevCommentHeight.constant = 25.0
        }else{
            self.pmrPrevCommentHeight.constant = 0.0
            
        }
        
    }
    
    
    var isExpanded:Bool = false
    {
        didSet
        {
            if !isExpanded {
                self.commentHieght.constant = 0.0
                
            } else {
                self.commentHieght.constant = 30.0
            }
        }
    }
    
    
    //Prevents overide of data into cells when scrolling
    override func prepareForReuse() {
        super.prepareForReuse()

        
    }
    @IBAction func sliderChanged(_ sender: Any) {
        self.percentValue.text = String(round(self.percentSlider.value*10)/10)
    }
    
    @IBAction func switchClicked(_ sender: Any) {
        
        if(self.pfSwitch.isOn){
            self.pfValue.text = "Pass"
            self.pfValue.textColor = hexStringToUIColor(hex: "12b481")
        }else{
            self.pfValue.text = "Fail"
            self.pfValue.textColor = hexStringToUIColor(hex: "a00606")
        }

    }
    func hexStringToUIColor (hex:String) -> UIColor {
        var cString:String = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        
        if (cString.hasPrefix("#")) {
            cString.remove(at: cString.startIndex)
        }
        
        if ((cString.count) != 6) {
            return UIColor.gray
        }
        
        var rgbValue:UInt32 = 0
        Scanner(string: cString).scanHexInt32(&rgbValue)
        
        return UIColor(
            red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
            green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
            blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
            alpha: CGFloat(1.0)
        )
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    

}
