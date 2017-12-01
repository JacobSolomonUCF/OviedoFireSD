package comtelekpsi.github.oviedofireandroid;

import android.widget.EditText;
import android.widget.TextView;

/**
 * Created by David on 9/13/2017.
 */

public class Equipment {
    String type;
    String status;
    String caption;
    String repairs;
    EditText mEditText;
    TextView mTextView;
    boolean passed;

    public Equipment(){
    }

    //pf (pass/fail)
    public Equipment(String type, String caption, boolean passed){
        this.type=type;
        this.caption=caption;
        this.passed=passed;
    }

    public Equipment(String type, String caption, String status, String repairs){
        this.type=type;
        this.caption=caption;
        this.status=status;
        this.repairs=repairs;
    }

    //pmr
    public Equipment(String type, String caption, String status, EditText mEditText){
        this.type=type;
        this.caption=caption;
        this.status=status;
        this.mEditText=mEditText;
    }

    //num
    public Equipment(String type, String caption, EditText mEditText){
        this.type=type;
        this.caption=caption;
        this.mEditText=mEditText;
    }

    //per
    public Equipment(String type, String caption, TextView mTextView){
        this.type=type;
        this.caption=caption;
        this.mTextView=mTextView;
    }
}
