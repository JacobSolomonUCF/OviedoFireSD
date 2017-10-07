//
//  toDoListTableViewCell.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 10/6/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit

class toDoListTableViewCell: UITableViewCell {

    @IBOutlet weak var formName: UILabel!
    @IBOutlet weak var vehicleName: UILabel!
    @IBOutlet weak var completeBy: UILabel!
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
