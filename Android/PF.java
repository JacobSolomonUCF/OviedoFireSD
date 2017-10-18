package comtelekpsi.github.oviedofireandroid;

import android.content.Context;
import android.graphics.Color;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;

import android.support.v7.widget.SwitchCompat;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import static android.view.View.generateViewId;

/**
 * Created by David on 9/26/2017.
 */

public class PF {

    boolean passed=false;

    public PF(){}

    public PF(final TableLayout tableLayout, final TableRow tableRow, final Context context, String caption){
        TextView textViewF = new TextView(context);
        textViewF.setText("FAIL");
        textViewF.setTextColor(Color.RED);
        TextView textViewP = new TextView(context);
        textViewP.setText("PASS");
        textViewP.setTextColor(Color.GREEN);
        tableRow.addView(textViewF);
        FancySwitch pfSwitch = new FancySwitch(context);
        pfSwitch.setChecked(false);
        pfSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked){
                    passed=false;
                }
                else
                    passed=true;
            }
        });
        pfSwitch.setText("");
        tableRow.addView(pfSwitch);
        tableRow.addView(textViewP);
    }
}

