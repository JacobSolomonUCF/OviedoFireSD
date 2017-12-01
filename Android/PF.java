package comtelekpsi.github.oviedofireandroid;

import android.content.Context;
import android.graphics.Color;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.LinearLayout;
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

    public PF(final TableLayout tableLayout, final TableRow tableRow, final Context context, String caption, boolean isTablet, int width, String result){
        LinearLayout linearLayout= new LinearLayout(context);
        TextView textViewF = new TextView(context);
        textViewF.setText("FAILED");
        textViewF.setTextColor(Color.RED);
        TextView textViewP = new TextView(context);
        textViewP.setText("PASSED");
        textViewP.setTextColor(Color.GREEN);
        //tableRow.addView(textViewF);
        tableRow.addView(linearLayout);
        linearLayout.addView(textViewF);
        FancySwitch pfSwitch = new FancySwitch(context);
        pfSwitch.setChecked(false);
        if (result!=null)
            if (result.compareTo("Passed")==0)
                pfSwitch.setChecked(true);
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
        if(isTablet){
            textViewF.setTextSize(25);
            pfSwitch.setTextSize(25);
            textViewP.setTextSize(25);
        }
        //tableRow.addView(pfSwitch);
        //tableRow.addView(textViewP);
        linearLayout.addView(pfSwitch);
        linearLayout.addView(textViewP);
        TableRow.LayoutParams textParams = new TableRow.LayoutParams(width/2, ViewGroup.LayoutParams.MATCH_PARENT);
        linearLayout.setLayoutParams(textParams);
        linearLayout.setGravity(Gravity.RIGHT);
        textViewF.setGravity(Gravity.RIGHT);
        pfSwitch.setGravity(Gravity.RIGHT);
        textViewP.setGravity(Gravity.RIGHT);

    }
}

