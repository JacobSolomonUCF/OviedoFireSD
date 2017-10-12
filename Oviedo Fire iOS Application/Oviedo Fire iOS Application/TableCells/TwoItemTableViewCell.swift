//
//  TwoItemTableViewCell.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 10/11/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit

class TwoItemTableViewCell: UITableViewCell {

    @IBOutlet weak var formName: UILabel!
    @IBOutlet weak var completedBy: UILabel!
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
