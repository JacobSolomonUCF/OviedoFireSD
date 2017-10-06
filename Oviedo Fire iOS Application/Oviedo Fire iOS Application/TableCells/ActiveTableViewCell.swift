//
//  ActiveTableViewCell.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 10/5/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit

class ActiveTableViewCell: UITableViewCell {

    @IBOutlet weak var vehicleName: UILabel!
    @IBOutlet weak var vehicleName2: UILabel!
    @IBOutlet weak var vehicleNumber: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
