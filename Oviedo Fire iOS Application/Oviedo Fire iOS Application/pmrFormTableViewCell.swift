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



class pmrFormTableViewCell: UITableViewCell{

    @IBOutlet weak var label: UILabel!
    @IBOutlet weak var presentButton: DLRadioButton!
    @IBOutlet weak var missingButton: DLRadioButton!
    @IBOutlet weak var needsRepairButton: DLRadioButton!
    @IBOutlet weak var commentsTextField: UITextField!
    
    
    //Prevents overide of data into cells when scrolling
    override func prepareForReuse() {
        super.prepareForReuse()
        self.commentsTextField = nil
        self.missingButton.isSelected = false
        self.presentButton.isSelected = false
        self.needsRepairButton.isSelected = false
        
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
