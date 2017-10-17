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
            self.pfValue.textColor = UIColor.green
        }else{
            self.pfValue.text = "Fail"
            self.pfValue.textColor = UIColor.red
        }

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
