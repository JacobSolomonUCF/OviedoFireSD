//
//  resultsTableViewCell.swift
//  Oviedo Fire iOS Application
//
//  Created by Jacob Solomon on 10/18/17.
//  Copyright © 2017 Jacob Solomon. All rights reserved.
//

import UIKit

class resultsTableViewCell: UITableViewCell {

    @IBOutlet weak var caption: UILabel!
    @IBOutlet weak var comments: UILabel!
    @IBOutlet weak var values: UILabel!
    @IBOutlet weak var commentHeight: NSLayoutConstraint!
    

    
    func setHeight(choice:Int){
        if(choice == 1){
            self.commentHeight.constant = 44.0
        }else{
            self.commentHeight.constant = 0.0
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
