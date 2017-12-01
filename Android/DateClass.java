package comtelekpsi.github.oviedofireandroid;

import android.app.DatePickerDialog;
import android.app.Dialog;
import android.os.Bundle;
import android.support.v4.app.DialogFragment;
import android.support.v4.app.FragmentActivity;
import android.support.v7.widget.AppCompatButton;
import android.view.View;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.TextView;

import java.util.Calendar;

/**
 * Created by David on 11/14/2017.
 */

public class DateClass{
    private int pYear;
    private int pMonth;
    private int pDay;
    private TextView dateText;
    private AppCompatButton button;
    private int bId;

    DateClass(AppCompatButton button, TextView dateText){
        this.dateText=dateText;
        this.button=button;
        final int id=button.getId();
        bId=id;
        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                //showDialog(id);
            }
        });
    }

    private DatePickerDialog.OnDateSetListener pDateSetListener =
            new DatePickerDialog.OnDateSetListener() {

                public void onDateSet(DatePicker view, int year,
                                      int monthOfYear, int dayOfMonth) {
                    pYear = year;
                    pMonth = monthOfYear;
                    pDay = dayOfMonth;
                    updateDisplay();
                    //displayToast();
                }
            };
    private void updateDisplay() {
        dateText.setText(
                new StringBuilder()
                        // Month is 0 based so add 1
                        .append(pMonth + 1).append("/")
                        .append(pDay).append("/")
                        .append(pYear));
    }
}
